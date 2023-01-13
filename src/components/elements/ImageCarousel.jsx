import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

// Carousel components with image array props
const ImageCarousel = ({
  images = [],
  simple = false,
}) => {
  const renderArrowNext = (onClickHandler, hasPrev, hasNext) => {
    return (
      <button
        type="button"
        onClick={onClickHandler}
        title="Next"
        className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 opacity-80 hover:opacity-100 hover:bg-gray-900/10 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-black fill-current mx-auto my-auto rotate-180"
          viewBox="0 0 24 24"
        >
          <path d="M15.41 16.09L10.83 11.5 15.41 6.91 14 5.5 8 11.5 14 17.5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </button>
    );
  };

  const renderArrowPrev = (onClickHandler, hasPrev, hasNext) => {
    return (
      <button
        type="button"
        onClick={onClickHandler}
        title="Previous"
        className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 opacity-80 hover:opacity-100 hover:bg-gray-900/10 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-black fill-current mx-auto my-auto rotate-180"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8.59 7.91L13.17 12.5 8.59 17.09 10 18.5 16 12.5 10 6.5z" />
        </svg>
      </button>
    );
  };

  const renderIndicator = (onClickHandler, isSelected, index, label) => {
    if (isSelected) {
      return (
        <li
          className="inline-block mx-1"
          aria-label={`Selected: ${label} ${index + 1}`}
          title={`Selected: ${label} ${index + 1}`}
        >
          <button
            type="button"
            className="w-2 h-2 bg-black  border border-black rounded-full"
            onClick={onClickHandler}
          />
        </li>
      );
    }
    return (
      <li
        className="inline-block mx-1"
        aria-label={`Go to slide ${index + 1}`}
        title={`Go to slide ${index + 1}`}
      >
        <button
          type="button"
          className="w-2 h-2 border border-black rounded-full opacity-60"
          onClick={onClickHandler}
        />
      </li>
    );
  };

  if (simple) {
    return (
      <Carousel
        interval={5000}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        autoPlay={true}
        centerMode={true}
        centerSlidePercentage={100}
        transitionTime={1000}
      >
        {images.map((item, index) => {
          return (
            <div key={index} className="h-full">
              <img
                src={item}
                alt={""}
                className="w-full h-full object-cover"
                style={{ minHeight: "100%" }}
              />
            </div>
          );
        })}
      </Carousel>
    );
  }

  return (
    <Carousel
      interval={5000}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      autoPlay={true}
      stopOnHover={false}
      swipeable={true}
      emulateTouch={true}
      dynamicHeight={true}
      centerMode={true}
      centerSlidePercentage={100}
      useKeyboardArrows={true}
      transitionTime={1000}
      swipeScrollTolerance={5}
      renderArrowNext={renderArrowNext}
      renderArrowPrev={renderArrowPrev}
      renderIndicator={renderIndicator}
    >
      {images.map((item, index) => {
        return (
          <div key={index}>
            <img src={item} alt={""} />
          </div>
        );
      })}
    </Carousel>
  );
};

export default ImageCarousel;
