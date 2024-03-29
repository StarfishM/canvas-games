(function () {
    const canv = document.getElementById("canv");
    const ctx = canv.getContext("2d");

    // startposition and moving factors of the ball
    let x = canv.width / 2;
    let y = canv.height - 30;
    let dx = 2;
    let dy = -2;

    // ball specs
    const ballRadius = 20;

    // blockPaddle specs
    const paddleHeight = 10;
    const paddleWidth = 85;
    let paddleX = (canv.width - paddleWidth) / 2;

    //brick specs
    let bRowTotal = 6;
    let bColumnTotal = 5;
    const brickWidth = 100;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    //add statusCount to brick
    const cutOffOne = 5;
    const cutOffTwo = 3;

    // statCounts
    const layerOne = 1;
    const layerTwo = 2;
    const layerThree = 3;

    // calculate winning score:
    const colFirstLayerScore = Math.floor((bRowTotal / cutOffOne) * layerOne);
    const colSecondLayerScore = Math.floor((bRowTotal / cutOffTwo) * layerTwo);
    const colThirdLayerScore =
        (bRowTotal -
            Math.floor(bRowTotal / cutOffOne) -
            Math.floor(bRowTotal / cutOffTwo)) *
        layerThree;
    const oneColTotalScore =
        colFirstLayerScore + colSecondLayerScore + colThirdLayerScore;
    console.log("oneColTotalScore", oneColTotalScore);
    const winningScore = oneColTotalScore * bColumnTotal;
    console.log("winningScore", winningScore);

    let bricks = [];
    for (let c = 0; c < bColumnTotal; c++) {
        bricks[c] = [];
        for (var r = 0; r < bRowTotal; r++) {
            if (r >= cutOffOne) {
                bricks[c][r] = { x: 0, y: 0, status: layerOne };
            } else if (r >= cutOffTwo) {
                bricks[c][r] = { x: 0, y: 0, status: layerTwo };
            } else {
                bricks[c][r] = { x: 0, y: 0, status: layerThree };
            }
        }
    }
    console.log("brick:", bricks);

    // user keys
    let rightDown = false;
    let leftDown = false;

    let score = 0;

    //event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode === 37 || e.key === "ArrowLeft") {
            leftDown = true;
        } else if (e.keyCode === 39 || e.key === "ArrowRight") {
            rightDown = true;
        }
    }
    function keyUpHandler(e) {
        if (e.keyCode === 37 || e.key === "ArrowLeft") {
            leftDown = false;
        } else if (e.keyCode === 39 || e.key === "ArrowRight") {
            rightDown = false;
        }
    }

    function collisionDetection() {
        for (let c = 0; c < bColumnTotal; c++) {
            for (let r = 0; r < bRowTotal; r++) {
                let b = bricks[c][r];
                if (b.status > 0) {
                    // ball is hitting a brick
                    // remember to deduct some pixels so that the outer edge of the ball gets detected when hitting the brick!!
                    if (
                        x > b.x &&
                        x < b.x + brickWidth + ballRadius &&
                        y > b.y &&
                        y < b.y + brickHeight + ballRadius
                    ) {
                        dy = -dy;
                        b.status -= 1;
                        score++;
                    }
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "pink";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(
            paddleX,
            canv.height - paddleHeight,
            paddleWidth,
            paddleHeight
        );
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < bColumnTotal; c++) {
            for (let r = 0; r < bRowTotal; r++) {
                if (bricks[c][r].status > 0) {
                    let brickX =
                        c * (brickWidth + brickPadding) + brickOffsetLeft;
                    let brickY =
                        r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = setBrickColor(bricks[c][r].status);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function setBrickColor(statusCount) {
        if (statusCount === 3) {
            return "blue";
        } else if (statusCount === 2) {
            return "yellow";
        } else if (statusCount === 1) {
            return "crimson";
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canv.width, canv.height);
        drawBall();
        drawPaddle();
        drawBricks();
        collisionDetection();
        drawScore();

        if (score == winningScore) {
            console.log("WIN!!!!");
            alert("you just won you magnificent creature🎉");
        }
        // check if the ball has reached the side walls
        if (x + dx > canv.width - ballRadius || x + dx < ballRadius) {
            console.log("hitting a side");
            dx = -dx;
        }
        // we have reached the top
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canv.height - ballRadius - paddleHeight) {
            // check if the paddle is there to bounce the ball back
            if (x >= paddleX - 15 && x <= paddleX + paddleWidth + 15) {
                var randomAngleShift = Math.random() * (0.5 - 0.1 + 1) + 0.1;
                dy = -dy - randomAngleShift;
                console.log("dy:", dy);
                if (dy <= -6) {
                    dy = -3;
                }
            } else {
                alert(`You did not catch the ball at the bottom
                L O O S E R`);
                document.location.reload();
                clearInterval(interval);
            }
        }
        if (rightDown) {
            // if right is down move right
            paddleX += 7;
            if (paddleX + paddleWidth > canv.width) {
                paddleX = canv.width - paddleWidth;
            }
            // if left is down move left
        } else if (leftDown) {
            paddleX -= 7;
            if (paddleX < 0) {
                paddleX = 0;
            }
        }

        x += dx;
        y += dy;
    }

    let interval = setInterval(draw, 10);
})();
