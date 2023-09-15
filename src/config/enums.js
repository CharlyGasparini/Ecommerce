/*
enumeracion de estrategias de passport, en un objeto, en vez de usar un switch case
*/

const passportStrategiesEnum = {
    JWT: "jwt",
    NOTHING: "na" //Caso que no se este aplicando ninguna estrategia
}

export {
    passportStrategiesEnum
}