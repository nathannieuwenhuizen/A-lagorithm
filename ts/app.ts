import Grid from './grid';
export default class App {

    public grid: Grid;
    public canvas: any;
    public ctx: CanvasRenderingContext2D;

    public playButton: Element;
    public stepButton: Element;
    public resetButton: Element;
    public clearWallsButton: Element;
    public randomWallsButton: Element;

    public diagonalCheckBox: Element;
    public showParentLinesCheckboc: Element;
    public showValuesCheckboc: Element;

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");

        this.grid = new Grid(15,11, this.canvas);

        this.canvas.width = this.grid.width * this.grid.cellSize;
        this.canvas.height = this.grid.height * this.grid.cellSize;



        this.playButton = document.getElementById('playButton');
        this.playButton.addEventListener('click', () => {
            this.grid.updatePath = !this.grid.updatePath;
            this.playButton.value = this.grid.updatePath ? "Play" :  "Play";
        });
        this.stepButton = document.getElementById('stepButton');
        this.stepButton.addEventListener('click', () => {
            this.grid.makeFastestChoice();// = !this.grid.updatePath;
        });
        this.resetButton = document.getElementById('resetButton');
        this.resetButton.addEventListener('click', () => {
            this.grid.reset();
        });

        this.clearWallsButton = document.getElementById('clearWallsButton');
        this.clearWallsButton.addEventListener('click', () => {
            this.grid.reset();
            this.grid.clearGrid();
        });

        this.randomWallsButton = document.getElementById('randomWallsButton');
        this.randomWallsButton.addEventListener('click', () => {
            this.grid.reset();
            this.grid.randomGrid(.8);
        });

        this.diagonalCheckBox = document.getElementById('diagonal');
        this.showParentLinesCheckboc = document.getElementById('showParentLine');
        this.showValuesCheckboc = document.getElementById('showDistances');


        setInterval(() => {
            this.grid.update();
            this.grid.Draw(this.ctx, this.canvas);
            this.grid.diagnoalPaths = this.diagonalCheckBox.checked;
            this.grid.showParentLines = this.showParentLinesCheckboc.checked;
            this.grid.showValues = this.showValuesCheckboc.checked;
        }, 20);
        
    }

}
window.addEventListener('load', () => {
    new App();
}, false);
