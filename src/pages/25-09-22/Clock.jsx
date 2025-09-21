<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Four Elements - Stripes</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }

    .stripe {
      width: 100%;
      height: 25vh; /* each stripe takes 1/4 of the viewport height */
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }

    .fire {
      background-color: #e74c3c; /* red/orange */
    }

    .air {
      background-color: #f1c40f; /* yellow */
      color: #333;
    }

    .water {
      background-color: #3498db; /* blue */
    }

    .earth {
      background-color: #27ae60; /* green */
    }
  </style>
</head>
<body>
  <div class="stripe fire">Fire – Energy, Transformation, Passion</div>
  <div class="stripe air">Air – Intellect, Communication, Movement</div>
  <div class="stripe water">Water – Emotion, Fluidity, Intuition</div>
  <div class="stripe earth">Earth – Stability, Growth, Grounding</div>
</body>
</html>
