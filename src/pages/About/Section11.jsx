import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import './Section11.css';

import Tom from "../../assets/Tom.png";
import Emma from "../../assets/Emma.png";
import Will from "../../assets/Will.png";

const Section11 = () => {
    const team = [
        { id: 1, name: "Tom Cruise", role: "Founder & Chairman", img: Tom },
        { id: 2, name: "Emma Watson", role: "Managing Director", img: Emma },
        { id: 3, name: "Will Smith", role: "Product Designer", img: Will },
        { id: 4, name: "Tom Cruise", role: "Founder & Chairman", img: Tom },
        { id: 5, name: "Emma Watson", role: "Managing Director", img: Emma },
    ];

    return (
        <section className="section11-team">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, el: '.section11-dots' }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="section11-swiper"
            >
                {team.map((member) => (
                    <SwiperSlide key={member.id}>
                        <div className="section11-member-card">
                            <div className="section11-img-holder">
                                <img src={member.img} alt={member.name} />
                            </div>
                            <div className="section11-info">
                                <h3 className="section11-name">{member.name}</h3>
                                <p className="section11-role">{member.role}</p>
                                <div className="section11-socials">
                                    <FaTwitter size={20} />
                                    <FaInstagram size={20} />
                                    <FaLinkedinIn size={20} />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="section11-dots"></div>
        </section>
    );
};

export default Section11;