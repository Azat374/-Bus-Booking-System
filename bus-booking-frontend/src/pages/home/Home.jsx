import React from "react";
import Hero from "./hero/Hero";
import Search from "../../components/searchform/Search";
import Category from "./category/Category";
import Offer from "./offer/Offer";
import Footer from "../../components/footer/Footer";
const Home = () => {
  return (
    <>
      <Hero />
      <Search />
      <Footer/>
    </>
  );
};

export default Home;
