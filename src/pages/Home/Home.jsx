import React, { useState } from 'react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';
import Section8 from './Section8';
const Home = ({ searchValue }) => {
    const [category, setCategory] = useState('');
    const isSearching = searchValue && searchValue.trim().length > 0;

    return (
        <main>
            {!isSearching && !category && <Section1 />}

            {!category && <Section2 searchValue={searchValue} />}

            {!isSearching && <Section3 activeCategory={category} setActiveCategory={setCategory} />}

            {!category && <Section4 searchValue={searchValue} />}

            {!category && <Section5 searchValue={searchValue} />}

            <Section6 searchValue={searchValue} category={category} />

            {!isSearching && !category && (
                <>
                    <Section7 />
                    <Section8 />
                </>
            )}

        </main>
    );
};

export default Home;