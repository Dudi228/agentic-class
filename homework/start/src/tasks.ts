export type Filter = "all" | "open" | "done"

export interface Task {
    id: number
    title: string
    done: boolean
}

/**
 * Доска в том виде, в каком она приходит из хранилища. Строку 3 сохранила старая
 * форма ещё до issue #7: это название из одних пробелов, и оно всё ещё здесь.
 */
export const seedTasks: Task[] = [
    { id: 1, title: "Сдать лабораторную", done: false },
    { id: 2, title: "Купить продукты", done: true },
    { id: 3, title: "   ", done: false },
]

/**
 * Убирает по краям названия пробелы, табы, NBSP и zero-width space (U+200B),
 * который обычный trim() не трогает.
 */
function normalizeTitle(title: string): string {
    return title.replace(/^[\s\u200B]+|[\s\u200B]+$/g, "")
}

/** Доска считает название без непробельных символов отсутствующим названием. */
export function isBlankTitle(title: string): boolean {
    return normalizeTitle(title).length === 0
}

/** Сообщение, которое показываем при попытке сделать название пустым. */
export const BLANK_TITLE_ERROR = "Нельзя делать строку пустой"

/**
 * Создание задачи. Форма создания проверяла название всегда — проблема в пути
 * переименования ниже: старая форма сохраняла название без проверки.
 */
export function createTask(id: number, title: string): Task | undefined {
    const trimmed = normalizeTitle(title)
    if (trimmed.length === 0) return undefined
    return { id, title: trimmed, done: false }
}

/**
 * Переименование существующей задачи. Пустое название не сохраняется:
 * задача остаётся прежней, а невалидный ввод обрабатывает экран.
 */
export function renameTask(tasks: Task[], id: number, title: string): Task[] {
    if (isBlankTitle(title)) return tasks
    const trimmed = normalizeTitle(title)
    return tasks.map((task) => (task.id === id ? { ...task, title: trimmed } : task))
}

export function visibleTasks(tasks: Task[], filter: Filter): Task[] {
    const named = tasks.filter((task) => !isBlankTitle(task.title))
    if (filter === "open") return named.filter((task) => !task.done)
    if (filter === "done") return named.filter((task) => task.done)
    return named
}

/** Счётчик в шапке учитывает только настоящие открытые задачи. */
export function openCount(tasks: Task[]): number {
    return tasks.filter((task) => !task.done && !isBlankTitle(task.title)).length
}
