const getData = (resource, callback) => {
  const request = new XMLHttpRequest();

  request.addEventListener('readystatechange', () => {
    if (request.readyState === 4 && request.status === 200) {
      const data = JSON.parse(request.responseText);
      callback(undefined, data);
    } else if (request.readyState === 4) {
      callback('could not fetch the data', undefined);
    }
  });
  request.open('GET', resource);
  request.send();
};

getData('todos.json', loadData);
getData('questions.json', loadData);
getData('glossary.json', loadData);

function loadData(err, data) {
  if (err) {
    throw new Error(err);
  }
  console.log(data);
}
