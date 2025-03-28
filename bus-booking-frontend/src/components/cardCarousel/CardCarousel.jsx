import { Carousel } from "react-bootstrap";
import "./CardCarousel.css"; // Өз стиліңізді импорттаңыз
import CardImage from "../../assets/images/card.jpg";

function CardCarousel() {
  return (
    <Carousel className="custom-carousel" interval={1400} indicators={false}>
      <Carousel.Item>
        <div className="card-group">
          <div className="card">
            <img src={CardImage} alt="Ұсыныс 1" />
            <h2>Автобус билеттеріне жеңілдік</h2>
            <h3>АЛҒАШҚЫ АВТОБУС</h3>
            <p>Автобус билеттеріне 250 〒-қа дейін үнемдеңіз</p>
          </div>
          <div className="card">
            <img src={CardImage} alt="Ұсыныс 2" />
            <h2>Автобус билеттеріне жеңілдік</h2>
            <h3>АЛҒАШҚЫ АВТОБУС</h3>
            <p>Автобус билеттеріне 250 〒-қа дейін үнемдеңіз</p>
          </div>
          <div className="card">
            <img src={CardImage} alt="Ұсыныс 3" />
            <h2>Автобус билеттеріне жеңілдік</h2>
            <h3>АЛҒАШҚЫ АВТОБУС</h3>
            <p>Автобус билеттеріне 250 〒-қа дейін үнемдеңіз</p>
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className="card-group">
          <div className="card">
            <img src={CardImage} alt="Ұсыныс 1" />
            <h2>Автобус билеттеріне жеңілдік</h2>
            <h3>АЛҒАШҚЫ АВТОБУС</h3>
            <p>Автобус билеттеріне 250 〒-қа дейін үнемдеңіз</p>
          </div>
          <div className="card">
            <img src={CardImage} alt="Ұсыныс 2" />
            <h2>Автобус билеттеріне жеңілдік</h2>
            <h3>АЛҒАШҚЫ АВТОБУС</h3>
            <p>Автобус билеттеріне 250 〒-қа дейін үнемдеңіз</p>
          </div>
          <div className="card">
            <img src={CardImage} alt="Ұсыныс 3" />
            <h2>Автобус билеттеріне жеңілдік</h2>
            <h3>АЛҒАШҚЫ АВТОБУС</h3>
            <p>Автобус билеттеріне 250 〒-қа дейін үнемдеңіз</p>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default CardCarousel;
