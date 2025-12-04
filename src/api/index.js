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

export async function getUserByUsername(username) {
    try {
        const res = await fetch(`http://localhost:8080/users/username/${username}`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch users:", error);
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


export async function getTransactions() {
    try {
        const res = await fetch('http://localhost:8080/transactions')
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw error;
    }
}

export async function getPositions() {
    try {
        const res = await fetch('http://localhost:8080/positions')
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch positions:", error);
        throw error;
    }
}

export async function getUserPositions(id) {
    try {
        const res = await fetch(`http://localhost:8080/users/${id}/positions`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch Player specified by id (${id})`, error);
        throw error;
    }
}

export async function getUserTransactions(id) {
    try {
        const res = await fetch(`http://localhost:8080/users/${id}/transactions`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch Player specified by id (${id})`, error);
        throw error;
    }
}