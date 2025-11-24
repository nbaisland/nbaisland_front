export async function getPlayers(ids = null) {
  try {
    let res;

    if (ids) {
      res = await fetch(`http://localhost:8080/players?ids=${ids.join(',')}`);
    } else {
      res = await fetch('http://localhost:8080/players');
    }

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch players:", error);
    throw error;
  }
}


export async function getPlayerById(id) {
    try {
        const res = await fetch(`http://localhost:8080/players/${id}`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch Player specified by id (${id})`, error);
        throw error;
    }
}

export async function getUsers() {
    try {
        const res = await fetch('http://localhost:8080/users')
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}


export async function getHoldings() {
    try {
        const res = await fetch('http://localhost:8080/holdings')
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch Holdings:", error);
        throw error;
    }
}
