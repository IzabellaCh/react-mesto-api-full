class Authorization {
  constructor(data) {
    this._baseUrl = data.baseUrl;
    this._headers = data.headers;
  }
  
  _checkResponse (res) {
    if (res.ok) {
      return res.json();
    } 
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  register(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        password: password,
        email: email
      })
    })
    .then(this._checkResponse)
  }

  login(email, password) {
    return fetch(`${this._baseUrl}/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        password: password,
        email: email
      })
    })
    .then(this._checkResponse)
  }

  checkToken() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: this._headers,
    })
    .then(this._checkResponse)
  }
  
  // старое получение токена
  // checkToken(jwt) {
  //   return fetch(`${this._baseUrl}/users/me`, {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${jwt}`
  //     }
  //   })
  //   .then(this._checkResponse)
  // }
}

export const authorization = new Authorization({
  // baseUrl: 'http://localhost:3001',
  baseUrl: 'http://mesto.edu-project.nomoredomains.club',
  headers: {
    "Content-Type": "application/json" 
  },
});