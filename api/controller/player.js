import { v4 as uuidv4 } from "uuid";

let players = [];

function createPlayer(name, password) {
  return new Promise((resolve,reject) => {
    // Input validation.
    const inputValid = (name != undefined && password != undefined);
    const playerExists = players.some((item) => {
      return item.name === name;
    });
    // If everything is fine, create and return player,
    // otherwise return object containing error string.
    if (!inputValid) {
      reject({ msg: "Input not valid" });
    } else if (playerExists) {
      reject({ msg: "Name is already taken." });
    } else {
      const player = {
        id: uuidv4(),
        name: name,
        password: password,
        status: "online"
      };
      players.push(player);
      resolve(player);
    }
  });
}

function getAllPlayers(id) {
  // Remove passwords for security reasons.
  return players.map(({password, ...player}) => player ).filter((player) => player.id != id);
}

function getPlayer(name, password) {
  return new Promise((resolve,reject) => {
    // Input validation.
    const inputValid = (name != undefined && password != undefined);
    // Find player in player array.
    const player = players.filter((player) => {
      return player.name === name;
    })[0];
    // If everything is fine, return player,
    // otherwise return object containing error string.
    if(!inputValid){
      reject({msg: "Input not valid!"});
    } else if (player === undefined) {
      reject({msg: "Player unkown!"});
    } else if (player.password != password) {
      reject({msg: "Password incorrect!"});
    } else {
      // Remove password before returning object.
      delete player.password;
      // TODO: Update playerstatus to "online" in array
      // and do something with it on the front end.
      resolve(player);
    }
  });
}

export { createPlayer, getPlayer, getAllPlayers };
