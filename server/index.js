const fs = require('fs');

const express = require('express');
const app = express();

const universitiesAndDomains = JSON.parse(fs.readFileSync('world_universities_and_domains.json', 'utf8'));

app.get('/search', paginateList(universitiesAndDomains), (req, res) => {
  res.json({ list: res.list, pageResponseInformation: res.pageResponseInformation });
});

function paginateList(list) {
  return (req, res, next) => {
    const { name = '' } = req.query;
    let limit = Number.parseInt(req.query.limit, 10);
    let offset = Number.parseInt(req.query.offset, 10);
    if (Number.isNaN(limit)) {
      limit = Infinity;
    }
    if (Number.isNaN(offset)) {
      offset = 0;
    }
    let findList = [];
    if (name) {
      for(let i = 0; i < list.length; i++) {
        if (list[i].name.toLowerCase().includes(name.toLowerCase())) {
          findList.push(list[i]);
        }
      }
    } else {
      findList = list;
    }
    const paginationList = findList.slice(offset, offset + limit);
    res.list = paginationList;
    res.pageResponseInformation = {
      totalRecordCount: findList.length,
      offset,
      limit,
    };
    next();
  };
}

app.listen(8080);