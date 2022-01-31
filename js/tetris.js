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
        [[2,1],[0,1],[1,0],[1,1]], // 좌표값
        [],
        [],
        [],
    ]

}


const movingItem = { //원복용/ 실질적으로 다음 아이템의 타입과 좌표 등의 정보를 가지고 있음
    type: "tree", // 얘가 블럭의 형태를 가져옴 ex) tree
    direction: 0, //화살표로 돌리는 용도
    top: 0, // 좌표기준으로 어디인지 상하
    left: 3, // 좌우값을 알려주는 기능
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
function renderBlocks() { // 블럭 그림
    const { type, direction, top, left} = tempMovingItem // 각각의 프로퍼티들을 변수로 바로 사용할 수 있도록 해줌
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving") // 기존의 있었던 애들을 없애줌
    })
    // tempMovingItem.type 위처럼 안해주면 이런식으로 각각으로 접근해야하는 번거로움 있음
    // tempMovingItem.direction
    BLOCKS[type][direction].forEach(block => {
        const x = block[0] + left// ul안의 li의 값
        const y = block[1] + top// li의 low값
        //console.log({playground}) // 출력 NodeList있음
        const target = playground.childNodes[y].childNodes[0].childNodes[x]
        target.classList.add(type)
    }) // 좌표를 가진 애들을 가져와서 forEach 적용
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount// left를 바꿔주게 됨
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
        default :
            break;
    }
})