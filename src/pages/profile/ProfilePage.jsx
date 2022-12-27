import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
const ProfilePage = () => {
  return (
    <LayoutContainer>
      <ShadowBox className={"shadowBoxBtnSmall"}>
        <div className="flex flex-row justify-start gap-4 items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-black">
          <SvgIconStyle
            src={"/assets/icons/star-icon.svg"}
            className="w-[26px] h-[26px] bg-white"
          />
          MY PROFILE
        </div>
        <div className="flex m-5 flex-col lg:flex-row p-2">
          <CollectionImage
            src={"/assets/picture/sample1.png"}
            className="aspect-[1/1] max-w-[250px] w-full"
          />
          <div className="ml-0 mt-5 lg:ml-5 lg:mt-[-9px] flex flex-col lg:flex-row justify-start w-full">
            <div className="max-w-full lg:pr-5">
              <div className="subtitle">Name</div>
              <div>{"SINKA"}</div>
              <div className="subtitle mt-5">Bio</div>
              <div>{"JKT 48 Gen 8"}</div>
              <div className="subtitle mt-5">Join Since</div>
              <div>{"December 2022"}</div>
            </div>
            <div className="max-w-full ml-0 mt-5 lg:mt-0 lg:ml-5">
              <div className="subtitle">Name</div>
              <div>{"SINKA"}</div>
            </div>
          </div>
        </div>
      </ShadowBox>
    </LayoutContainer>
  );
};

export default ProfilePage;
