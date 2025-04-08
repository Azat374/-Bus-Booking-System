import React, { useState, useEffect } from "react";
import { axiosInst } from "../../service/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Search = () => {
  const navigate = useNavigate();

  // Список станций
  const [stationList, setStationList] = useState([]);
  // Выбранные станции
  const [selectedFromStation, setSelectedFromStation] = useState("");
  const [selectedToStation, setSelectedToStation] = useState("");

  // Дата и время
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Список автобусов (результат поиска)
  const [buses, setBuses] = useState([]);
  // Флаг "не найдено"
  const [noBusesFound, setNoBusesFound] = useState(false);

  // Станции для поля To (исключаем ту, что выбрана в From)
  const [filteredToOptions, setFilteredToOptions] = useState([]);
  const {ClassOptions} = {
    ClassOptions: [
      { id: "ECONOMY", name: "Эконом" },
      { id: "COMFORT", name: "Комфорт" },
      { id: "BUSINESS", name: "Бизнес" },
    ],
  }
  const [classes, setClass] = "ECONOMY";
  const { t, i18n } = useTranslation();

  // Загрузка списка станций при монтировании
  useEffect(() => {
    fetchStationList();
  }, []);

  // Фильтруем список станций для To, исключая выбранную в From
  useEffect(() => {
    if (selectedFromStation) {
      setFilteredToOptions(
        stationList.filter((s) => s.id.toString() !== selectedFromStation)
      );
    } else {
      setFilteredToOptions(stationList);
    }
  }, [stationList, selectedFromStation]);

  const fetchStationList = () => {
    axiosInst
      .get("/station/getstations")
      .then((response) => {
        setStationList(response.data);
        setFilteredToOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stations:", error);
        toast.error("Failed to fetch station list");
      });
  };

  const handleFromChange = (e) => {
    setSelectedFromStation(e.target.value);
  };

  const handleToChange = (e) => {
    setSelectedToStation(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleClassChange = (e) => {
    setClass(e.target.value);
  };
  // Поиск автобусов
  const search = () => {
    if (!selectedFromStation || !selectedToStation || !selectedDate) {
      toast.warning("Please select From, To, and Date");
      return;
    }

    const requestBody = {
      from: selectedFromStation,
      to: selectedToStation,
      date: selectedDate,
      // time: selectedTime, // если бекенд поддерживает время
    };

    axiosInst
      .post("/bus/getbuses", requestBody)
      .then((response) => {
        setBuses(response.data);
        if (response.data.length === 0) {
          setNoBusesFound(true);
          toast.warning("Oops! No buses found for that date or route");
        } else {
          setNoBusesFound(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching buses:", error);
        toast.error("Failed to fetch buses");
      });
  };

  // При нажатии "Reserve Seat"
  const handleBookNow = (busId) => {
    navigate(`/buslayout/${busId}`);
  };

  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 my-[8ch]">
      <ToastContainer />

      {/* Блок поиска */}
      <div className="w-full bg-neutral-100 rounded-md p-8">
        <div className="grid grid-cols-3 gap-x-10 gap-y-12 items-end">
          {/* FROM */}
          <div>
            <label htmlFor="from" className="block mb-2 font-semibold">
              {t("search.from")}
            </label>
            <select
              name="from"
              id="from"
              className="w-full appearance-none bg-neutral-200/60 px-3 h-12 border border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100"
              value={selectedFromStation}
              onChange={handleFromChange}
            >
              <option value="">Select Location</option>
              {stationList.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.station_name}
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div>
            <label htmlFor="to" className="block mb-2 font-semibold">
              {t("search.to")}
            </label>
            <select
              name="to"
              id="to"
              className="w-full appearance-none bg-neutral-200/60 px-3 h-12 border border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100"
              value={selectedToStation}
              onChange={handleToChange}
            >
              <option value="">Select Location</option>
              {filteredToOptions.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.station_name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label htmlFor="date" className="block mb-2 font-semibold">
              {t("search.date")}
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full appearance-none bg-neutral-200/60 px-3 h-12 border border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100"
            />
          </div>

          {/* TIME (опционально) */}
          <div>
            <label htmlFor="time" className="block mb-2 font-semibold">
              {t("search.class")}
            </label>
            <select
              name="class"
              id="class"
              className="w-full appearance-none bg-neutral-200/60 px-3 h-12 border border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100"
              value={classes}
              onChange={handleClassChange}
            >
              <option value="">Класс</option>
              {ClassOptions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            {/*<input
              type="time"
              name="time"
              id="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="w-full appearance-none bg-neutral-200/60 px-3 h-12 border border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100"
            />*/}
          </div>

          {/* Кнопка поиска */}
          <div>
            <button
              className="w-full px-4 h-12 bg-violet-600 text-white rounded-md hover:bg-violet-700"
              onClick={search}
            >
              {t("search.search")}
            </button>
          </div>
        </div>
      </div>

      {/* Список результатов */}
      <div className="mt-10">
        {noBusesFound ? (
          <p className="text-center text-red-500 text-lg">{t("search.noBuses")}</p>
        ) : (
          // Вот здесь стилизуем карточки автобусов красиво
          <div className="space-y-4">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
              >
                {/* Левая часть карточки (Информация об автобусе) */}
                <div>
                  <h2 className="font-semibold text-base mb-1">
                    {bus.busNo} | {bus.from} → {bus.to}
                  </h2>
                  {/* Если нужно время */}
                  <p className="text-sm text-gray-500">
                    {bus.startTime} — {bus.endTime}
                  </p>
                  {/* Стоимость и кол-во мест */}
                  <p className="text-sm mt-2">
                    {t("search.cost")}: {bus.cost} / per seat
                  </p>
                  <p className="text-sm text-green-600">
                    {bus.availableSeats} {t("search.availableSeats")}
                  </p>
                </div>

                {/* Кнопка "Reserve Seat" */}
                <button
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleBookNow(bus.id)}
                >
                  {t("search.reserve")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
