import Vector from "./vector";

export default class GridCell {

    public size: number;
    public pos: Vector;

    public filled: boolean = false;
    public start: boolean = false;
    public end: boolean = false;
    public guessed: boolean = false;
    public guessedNeighbour: boolean = false;
    public finalPath: boolean = false;

    public dStart: number = 0;
    public dEnd: number = 0;
    public parentCell: GridCell;

    constructor(_x: number, _y: number, _size: number){
        this.size = _size;
        this.pos = new Vector(_x, _y);

        this.dStart = 0;
    }
    /**
     * getTotalDistance
     */
    public getTotalDistance(): number {
        return this.dStart + this.dEnd;
    }
    public DrawLine(ctx: CanvasRenderingContext2D): void {
        if (this.parentCell != undefined) {
            ctx.moveTo(this.pos.x * this.size + this.size / 2, this.pos.y * this.size + this.size / 2);
            ctx.lineTo(this.parentCell.pos.x * this.size  + this.size / 2, this.parentCell.pos.y * this.size  + this.size / 2);
            ctx.stroke();
        }

    }
    public DrawValues(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#000';

        ctx.font = "10px Arial";
        ctx.fillText( (this.filled ? "fill" :"") + Math.floor(this.dStart * 10) / 10, this.pos.x * this.size + this.size / 2 - 10, this.pos.y * this.size +  this.size / 2 - 15);
        ctx.fillText( (this.filled ? "fill" :"") + Math.floor(this.dEnd * 10) / 10, this.pos.x * this.size + this.size / 2 -10, this.pos.y * this.size +  this.size / 2);
        ctx.fillText("" + Math.floor(this.getTotalDistance() * 10) / 10, this.pos.x * this.size + this.size / 2, this.pos.y * this.size +  this.size / 2 + 15);
    }
    
    public Draw(ctx: CanvasRenderingContext2D): void {
            ctx.beginPath();

        ctx.rect(this.pos.x * this.size, this.pos.y * this.size, this.size, this.size);
        ctx.stroke();
        
        if (this.filled) {
            ctx.fillStyle = '#000';
            ctx.fill();
        }
         else if (this.start) {
            ctx.fillStyle = '#0f0';
            ctx.fill();
        } else if (this.end) {
            ctx.fillStyle = '#f00';
            ctx.fill();
        } else if (this.finalPath) {
            ctx.fillStyle = '#00f';
            ctx.fill();
        } else if (this.guessed) {
            ctx.fillStyle = '#9f9';
            ctx.fill();
        } else if (this.guessedNeighbour) {
            ctx.fillStyle = '#ff0';
            ctx.fill();
        }
        ctx.closePath();

        ctx.fillStyle = '#000';
    } 

    get Start(): boolean {
        return this.start;
    }
    set Start(value: boolean) {
        this.start = value;
        if (value) {
            this.filled = false;
        }
    }
    get End(): boolean {
        return this.end;
    }
    set End(value: boolean) {
        this.end = value;
        if (value) {
            this.filled = false;
        }
    }
}
