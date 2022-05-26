export async function getGames() {
  const fetchedGames = await fetch("http://localhost/games/index.json")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((data) => {
      console.log("fetched");
      return data.games;
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });

  return fetchedGames;
}

export async function addGame(gameData) {
  if (gameData.winnerResult != null && gameData.numMoves != null) {
    const result = await fetch("http://localhost/games/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        winner: gameData.winnerResult,
        num_moves: gameData.numMoves,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        console.log("successfully posted");
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error posting data: ", error);
      });

    return result;
  }

  return null;
}
