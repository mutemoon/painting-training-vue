
function calc(base, step) {
    return base + ((step) * 0x302010)
}

export default {
    question1: 0x777777,
    question2: calc(0x777777, 2),
    question3: calc(0x777777, 3),
    answer1: 0x9c27b0,
    answer2: calc(0x9c27b0, 2),
    answer3: calc(0x9c27b0, 3),
}
