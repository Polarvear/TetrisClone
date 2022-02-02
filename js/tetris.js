//DOM

const playground = document.querySelector(".playground > ul")

//Settings
const GAME_ROWs = 20
const GAME_COLS = 10

//자주 사용할 변수들 선언
let score = 0
let duration = 500
let downIntervla;
let tempMovingItem; //movingItem을 사용하기 전에 잠깐 담아두는 용도로 사용

const BLOCKS = {
    tree: [
        [[2,1],[0,1],[1,0],[1,1]], // 좌표값 tree라는 블럭의 각각의 모양 상태
        [[1,2],[0,1],[1,0],[1,1]], //direction 상태에 따라서 달라짐
        [[1,2],[0,1],[2,1],[1,1]],
        [[2,1],[1,2],[1,0],[1,1]],
    ]

}


const movingItem = { //원복용/ 실질적으로 다음 아이템의 타입과 좌표 등의 정보를 가지고 있음
    type: "tree", // 얘가 블럭의 형태를 가져옴 ex) tree
    direction: 2, //화살표로 돌리는 용도
    top: 0, // 좌표기준으로 어디인지 상하
    left: 0, // 좌우값을 알려주는 기능
}

//처음에 랜더링이 되면 init을 호출하는 방식
init()




// functions
function init() {
    tempMovingItem = {...movingItem} //안의 내용만 가져옴 스프레드로 담아주면 값만 담아줌 이렇게 하면 무빙아이템의 값이 바뀌어도 템프무빙아이템의 값은 그대로임
    for (let i = 0; i < 20; i++) {
        prependNewLine()
    }// 처리가 다 끝났으면
    renderBlocks()
}



function prependNewLine() {
    const li = document.createElement("li")
    const ul = document.createElement("ul")
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li")
        ul.prepend(matrix) // 이러면 ul태그안에 matrix가 들어감
    }
    li.prepend(ul)
    playground.prepend(li)
}
function renderBlocks(moveType= "") { // 블럭 그림
    const { type, direction, top, left} = tempMovingItem // 각각의 프로퍼티들을 변수로 바로 사용할 수 있도록 해줌
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving") // 기존의 있었던 애들을 없애줌
    })
    // tempMovingItem.type 위처럼 안해주면 이런식으로 각각으로 접근해야하는 번거로움 있음
    // tempMovingItem.direction
    BLOCKS[type][direction].some(block => { // forEach는 중간에 멈출수가 없어서 대신에 some 을 사용할 것임
        const x = block[0] + left// ul안의 li의 값
        const y = block[1] + top// li의 low값
        //console.log({playground}) // 출력 NodeList있음
        // 삼항연산자도 변수에 담을 수 있음
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null
        //타겟의 상태에 대해서 체크하는 용도
        const isAvailable = checkEmpty(target)
        if (isAvailable) {
            target.classList.add(type, "moving")// 타겟의 상태가 ture일 때만 새로운 블럭 추가
        } else {
            tempMovingItem = {...movingItem} // false의 경우
            setTimeout(() => { //이벤트 스택이 넘쳐버리는 걸 방지 call stack size exceeded 방지
                renderBlocks()
                if (moveType === "top") { //떨어지는 중에 없는 화면으로 나가버리면
                    seizeBlock() // 고정시키는 함수실행
                }
            },0)// task queue로 잠깐 빼놓음
            // renderBlocks()// 재귀함수로 호출 그러나 콜스택 맥시멈, 액시드 같은 경우가 발생할 수 있으므로 settimeout으로 잠깐 처리
            return true; // forEach는 이게 안되지만 some 은 가능
        }

    }) // 좌표를 가진 애들을 가져와서 forEach 적용
    movingItem.left = left //render 가 성공할 때마다 고정시켜줌
    movingItem.top = top
    movingItem.direction = direction
}
function seizeBlock() { // 더이상 내려갈 곳이 없을 때 블럭에서 moving 을 떼버리고 새로운 블럭을 만들어 줄 것임
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving")
        moving.classList.add("seized") // 이 요소를 가졌다면~
    })
    generateNewBlock()
}
function generateNewBlock() { // seized끝나면 새로운 블럭이 생기게 됨
    movingItem.type = 0
    movingItem.left = 3 // 가운데 와야하므로 3
    movingItem.direction = 0
    tempMovingItem = {...movingItem}
    renderBlocks()
}

// classList와 같이 쓰이는 함수 contains 그 클래스가 이것을 가지고 있는지 없는지 확인
function checkEmpty(target) { // ture or false 를 담아줌
    if(!target || target.classList.contains("seized")) {
        return false; //빈값이 아니다
    }
    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount// left를 바꿔주게 됨
    renderBlocks(moveType)

}
function changeDirection() {
    const direction = tempMovingItem.direction
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1
    // tempMovingItem.direction += 1
    // if (tempMovingItem.direction === 4) {
    //     tempMovingItem.direction = 0
    // } // 변수들이 반복되니까 가독성이 떨어지므로 삼항연산자에 담을 것임
    renderBlocks()
}

//event handling
document.addEventListener("keydown", e => { // keycode 추출
    switch(e.keyCode) { // switch 문을 통해서 각각의 형태 설정
        case 39 :
            moveBlock("left", 1);
            break;
        case 37 :
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            changeDirection()
            break;
        default :
            break;
    }
})