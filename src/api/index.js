
const API_BASE = 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function getPlayers(ids = null) {
  try {
    let res;

    if (ids) {
      res = await fetch(`${API_BASE}/players?ids=${ids.join(',')}`, {
        headers: getAuthHeaders()
    });
    } else {
      res = await fetch(`${API_BASE}/players`, {
        headers: getAuthHeaders()
    });
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
        const res = await fetch(`${API_BASE}/players/${id}`, {
        headers: getAuthHeaders()
    })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch Player specified by id (${id})`, error);
        throw error;
    }
}

export async function getPlayerByName(slug) {
    try {
        const res = await fetch(`${API_BASE}/players/name/${slug}`, {
        headers: getAuthHeaders()
    })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch Player specified by name (${slug})`, error);
        throw error;
    }
}

export async function getPlayerPositions(id) {
    try {
        const res = await fetch(`${API_BASE}/players/${id}/positions`, {
        headers: getAuthHeaders()
    })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch Player specified by id (${id})`, error);
        throw error;
    }
}

export async function getPlayerTransactions(id) {
    try {
        const res = await fetch(`${API_BASE}/players/${id}/transactions`, {
        headers: getAuthHeaders()
    })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error(`Failed to fetch Player specified by id (${id})`, error);
        throw error;
    }
}

export async function getUserByUsername(username) {
    try {
        const res = await fetch(`${API_BASE}/users/username/${username}`, {
        headers: getAuthHeaders()
    })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}

export async function getUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`, {
        headers: getAuthHeaders()
    })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}


export async function getTransactions() {
  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}


export async function getPositions() {
  try {
    const res = await fetch(`${API_BASE}/positions`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch positions:", error);
    return [];
  }
}


export async function getUserPositions(id) {
  try {
    const res = await fetch(`${API_BASE}/users/${id}/positions`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch positions for user (${id})`, error);
    return [];
  }
}


export async function getUserTransactions(id) {
  try {
    const res = await fetch(`${API_BASE}/users/${id}/transactions`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Failed to fetch transactions for user (${id})`, error);
    return [];
  }
}



export async function transactionBuy(user_id, player_id, quantity) {
  const res = await fetch(`${API_BASE}/transactions/buy`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      player_id,
      quantity,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

export async function transactionSell(user_id, player_id, quantity) {
  const res = await fetch(`${API_BASE}/transactions/sell`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      player_id,
      quantity,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}