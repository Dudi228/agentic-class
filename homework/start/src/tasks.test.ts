import { describe, expect, it } from "vitest"
import { createTask, visibleTasks, seedTasks, renameTask, isBlankTitle, openCount } from "./tasks"

// Два теста, с которыми поставляется стартер. Они проходят и не покрывают
// поведение, описанное в ISSUE-7.md.
describe("базовая доска", () => {
    it("создаёт задачу и обрезает название", () => {
        const task = createTask(9, "  Купить хлеб  ")
        expect(task?.title).toBe("Купить хлеб")
    })

    it("фильтрует готовые задачи", () => {
        expect(visibleTasks(seedTasks, "done").map((task) => task.id)).toEqual([2])
    })
})

describe("R1", () => {
    it.each(["", " ", "  ", "   ", "\t", "\u00A0", "\u200B"])("не дает переименовать в любую пустую строку", (a) => {
        const f = renameTask(seedTasks, 1, a);
        expect(f[0]?.title).toBe(seedTasks[0]?.title)
    })

    it.each(["\u200Babc","\u200Babc ","\u200Babc\t","\u200Babc\u200B","\u200Babc\u00A0" ,"\tabc", "\tabc ", "\tabc\t", "\tabc \u00A0", " abc ", " abc", " abc\t", " abc\u00A0", "\u00A0abc", "\u00A0abc ", "\u00A0abc\t", "\u00A0abc\u00A0"])("обрезает пробелы", (b) => {

        expect(createTask(2, b)?.title).toBe("abc")
    })
})

describe("R2", () => {
    it.each(["", " ", "  ", "   ", "\t", "\u00A0", "\u200B"])("не показывать пустые строки", (c) => {
        expect(createTask(52, c)?.title).toBeUndefined()
    })
    it("не показывает пустую строку из сохранённых данных", () => {
        const l = visibleTasks(seedTasks, "all").map((t) => t.title);

        expect(l.some((title) => isBlankTitle(title))).toBe(false);
    });

})

describe("R3", () => {
    it("счетчик не чситает пустую строку", () => {
        const count = seedTasks.filter((t) => !t.done && !isBlankTitle(t.title)).length;

        expect(openCount(seedTasks)).toBe(count)

    })
})
