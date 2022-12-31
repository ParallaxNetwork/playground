import { createContext, useContext, useState, useEffect } from "react";
import { useInterval } from "react-use";
import { useSigner } from "wagmi";
import { sleep } from "../../utilities/misc";
const OrbisContext = createContext({});

const CONVERSATION_CONTEXT = "playground";

const OrbisProvider = ({ children, orbis }) => {
  //   const { signer } = useSigner();
  const [profile, setProfile] = useState(null);
  const [hasLit, setHasLit] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [pauseGetConversations, setPauseGetConversations] = useState(false);
  const [signer, setSignerwagmi] = useState();

  const setSigner = (settedSigner) => {
    setSignerwagmi(settedSigner);
  };

  const connectOrbis = async (provider) => {
    if (!provider) return;

    const res = await orbis.connect_v2({
      provider,
      chain: "ethereum",
    });

    if (res.status !== 200) {
      await sleep(2000);
      await connectOrbis(provider);
    } else {
      const { data } = await orbis.getProfile(res.did);
      setProfile(data);
    }
  };

  const disconnectOrbis = () => {
    const res = orbis.logout();

    if (res.status === 200) {
      setProfile(null);
    }
  };

  const checkOrbisConnection = async (provider = null, autoConnect = false) => {
    const res = await orbis.isConnected();

    if (res.status === 200) {
      setHasLit(res.details.hasLit);
      const { data } = await orbis.getProfile(res.did);
      setProfile(data);
    } else if (autoConnect && provider) {
      await connectOrbis(provider);
    }
  };

  const connectLit = async (provider) => {
    const res = await orbis.connectLit(provider);
    setHasLit(res.status === 200);
    return res;
  };

  const getConversations = async () => {
    setPauseGetConversations(true);
    const { data } = await orbis.getConversations({
      did: profile?.did,
      context: CONVERSATION_CONTEXT,
    });
    setConversations(data);
    setPauseGetConversations(false);
    return data;
  };

  const getConversationByRecipient = (recipientDid, conversations) => {
    const filtered = conversations.filter((o) => {
      return o.recipients.includes(recipientDid);
    });

    if (filtered.length) {
      return filtered[0];
    } else {
      return null;
    }
  };

  const createConversation = async (recipientDid) => {
    if (!hasLit) {
      const res = await connectLit(signer?.provider?.provider);
      if (res.status !== 200) return;
    }

    const _conversations = await getConversations();
    const foundExisting = getConversationByRecipient(
      recipientDid,
      _conversations
    );

    if (foundExisting) {
      return foundExisting.stream_id;
    } else {
      const res = await orbis.createConversation({
        recipients: [recipientDid],
        context: CONVERSATION_CONTEXT,
      });

      if (res.status === 200) {
        await sleep();
        return res.doc;
      } else {
        return null;
      }
    }
  };

  //   useInterval(
  //     () => {
  //       getConversations();
  //     },
  //     !profile || pauseGetConversations ? null : 10000
  //   );

  //   useEffect(() => {
  //     if (profile) getConversations();
  //   }, [profile]);

  return (
    <OrbisContext.Provider
      value={{
        orbis,
        profile,
        hasLit,
        conversations,
        connectOrbis,
        disconnectOrbis,
        checkOrbisConnection,
        connectLit,
        setProfile,
        getConversations,
        createConversation,
        setSigner,
      }}
    >
      {children}
    </OrbisContext.Provider>
  );
};

const useOrbis = () => {
  return useContext(OrbisContext);
};

export { OrbisProvider, useOrbis };
