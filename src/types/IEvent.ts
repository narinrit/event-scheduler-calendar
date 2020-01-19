
export interface IEvent {
    id?: number | null,
    name: string,
    start: string,
    end: string,
    color: string,
    repeat: 'day' | 'week' | 'month' | 'year' | null,
    note: string,
}
