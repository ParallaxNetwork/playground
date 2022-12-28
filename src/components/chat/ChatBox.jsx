import CircleAvatar from "../elements/CircleAvatar";

const ChatBox = () => {
  const sampleData = [
    {
      username: "Sinka",
      date: "12/12/2022 10:57PM",
      chats: `Dengan katalis, peningkatan demand akan properti menjadi sentimen
            positif buat BBTN, karena kebanyakan pembiayaan properti kebanyakan
            dari kredit yang mana BBTN pegang market share sekitar 39%`,
    },
    {
      username: "Sinka",
      date: "12/12/2022 10:57PM",
      chats: `Dengan katalis, peningkatan demand akan properti menjadi sentimen
              positif buat BBTN, karena kebanyakan pembiayaan properti kebanyakan
              dari kredit yang mana BBTN pegang market share sekitar 39%`,
    },
    {
      username: "Sinka",
      date: "12/12/2022 10:57PM",
      chats: `Dengan katalis, peningkatan demand akan properti menjadi sentimen
            positif buat BBTN, karena kebanyakan pembiayaan properti kebanyakan
            dari kredit yang mana BBTN pegang market share sekitar 39%`,
    },
  ];

  return (
    <div>
      {sampleData.map((el, index) => {
        return (
          <div key={index} className="flex flex-row p-1 pt-4 pb-4">
            <CircleAvatar className="!w-[33px] !h-[33px]" />
            <div className="flex flex-col mx-3">
              <div className="flex flex-row  items-end space-x-2">
                <div className="bg-placeholder font-medium f-12-px">
                  {el.username}
                </div>
                <div className="bg-placeholder f-10-px bg-description">
                  {el.date}
                </div>
              </div>
              <div className="f-12-px text-[#2E2D44] pt-1">{el.chats}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
