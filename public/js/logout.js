const logout = async () => {
  //This is making a POST request to destroy the session on the back end.
  //It's making a POST request to my API to logout.
  //I am letting the server know we are sending JSON.
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  };
  
  document.querySelector('#logout').addEventListener('click', logout);