export default class Vector {
    public x: number = 0;
    public y: number = 0;
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }
    public normalize(size: number = 1) {
        let distance = this.length();
        this.x = this.x / distance * size;
        this.y = this.y / distance * size;
    }
    public length(): number {
        return Math.sqrt( this.x * this.x + this.y * this.y);
    }
}
