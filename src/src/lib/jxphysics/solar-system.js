// units = kg
export const M = {
    Sun: 1.98847e30,
    Earth: 5.9722e24,
    Moon: 7.342e22,
};

// units = m
export const R = {
    Sun: 6.957e8,
    Earth: 6.378e6,
    Moon: 1.7374e6,
}

export const SUN = {
    Mass: M.Sun,
    Radius: R.Sun,
};

export const EARTH = {
    Mass: M.Earth,
    Radius: R.Earth,
    Distance: {
        SUN: {
            Mean: 1.496E+11,
        },
        MOON: {
            Perigee: 3.626e8,
            Apogee: 4.054e8,
            Mean: (4.054e8 + 3.626e8)/2,
        },
    },
};

export const MOON = {
    Mass: M.Moon,
    Radius: R.Moon,
};