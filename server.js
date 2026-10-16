var express = require("express");
var app = express();

app.use(function(request, response) {
  console.log("In comes a request to: " + request.url);

  let subjects = [
    {
      id: 1,
      name: "Mathematics",
      location: "Ealing",
      price: 120,
      availableInventory: 5,
      img_data: {
        image: 'images/math.jpg',
        alt: "Teacher at whiteboard"
      }
    },
    {
      id: 2,
      name: "Science",
      location: "Wembley",
      price: 80,
      availableInventory: 5,
      img_data: {
        image: 'images/science.jpg',
        alt: "Man using electronic microscope"
      }
    },
    {
      id: 3,
      name: "History",
      location: "Wembley",
      price: 150,
      availableInventory: 5,
      img_data: {
        image: 'images/history.jpg',
        alt: "Library"
      }
    },
    {
      id: 4,
      name: "Geography",
      location: "Acton",
      price: 90,
      availableInventory: 5,
      img_data: {
        image: 'images/geography.jpg',
        alt: "Close-up of a vintage globe showing Asia"
      }
    },
    {
      id: 5,
      name: "Art",
      location: "Ealing",
      price: 70,
      availableInventory: 5,
      img_data: {
        image: 'images/art.jpg',
        alt: "Hand painting with a brush over a watercolour palette"
      }
    },
    {
      id: 6,
      name: "Music",
      location: "Harrow",
      price: 100,
      availableInventory: 5,
      img_data: {
        image: 'images/music.jpg',
        alt: "Person wearing headphones playing an acoustic guitar beside a keyboard and laptop"
      }
    },
    {
      id: 7,
      name: "English",
      location: "Wembley",
      price: 85,
      availableInventory: 5,
      img_data: {
        image: 'images/english.jpg',
        alt: "Open book with pages fanned out against a dark background"
      }
    },
    {
      id: 8,
      name: "Computing",
      location: "Ealing",
      price: 110,
      availableInventory: 5,
      img_data: {
        image: 'images/computing.jpg',
        alt: "Lines of colourful code on a computer screen"
      }
    },
    {
      id: 9,
      name: "PE",
      location: "Acton",
      price: 60,
      availableInventory: 5,
      img_data: {
        image: 'images/pe.jpg',
        alt: "Indoor sports hall with a basketball hoop and goal net"
      }
    },
    {
      id: 10,
      name: "Drama",
      location: "Harrow",
      price: 95,
      availableInventory: 5,
      img_data: {
        image: 'images/drama.jpg',
        alt: "Actors standing on a lit stage"
      }
    }
  ];

  response.json(subjects);
  // response.end("Hello, world!");
});

app.listen(3000, function() {
console.log("App started on port 3000");
});
