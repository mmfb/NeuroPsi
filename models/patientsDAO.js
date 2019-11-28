var patients = [
    {
        id:"11323",
        name:"José Carlos",
        age:29
    },
    {
        id:"11368",
        name:"João Gato",
        age:41
    },
    {
        id:"11523",
        name:"Gabriel Gois",
        age:32
    },
    {
        id:"32212",
        name:"Carla Rodrigues",
        age:37
    },
    {
        id:"32142",
        name:"Manuel Simão",
        age:56
    },
    {
        id:"11323",
        name:"José Carlos",
        age:29
    },
    {
        id:"11368",
        name:"João Gato",
        age:41
    },
    {
        id:"11523",
        name:"Gabriel Gois",
        age:32
    },
    {
        id:"32212",
        name:"Carla Rodrigues",
        age:37
    },
    {
        id:"32142",
        name:"Manuel Simão",
        age:56
    }
];

module.exports.getPatients = function(callback){
    callback(patients);
};