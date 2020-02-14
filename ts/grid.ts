import GridCell from './gridCell';
import Vector from './vector';

export default class Grid {
 
    public width: number;
    public height: number;
    public cellSize = 50;

    public updatePath: boolean = false;
    public foundPath: boolean = false;

    public canvas: Element;

    public cells: GridCell[];
    public startCell: GridCell;
    public endCell: GridCell;

    public diagnoalPaths = false;
    public showValues = false;
    public showParentLines = false;

    public startDrag = false;
    public endDrag = false;
    
    public neighbourCells: GridCell[];

    constructor(_width: number, _height: number, _canvas: Element) {
        this.width = _width;
        this.height = _height;
        this.canvas = _canvas;

        this.cells = [];
        for (let i: number = 0; i < this.height; i++) {
            for (let j: number = 0; j < this.width; j++) {
                this.cells[i * this.width + j] = new GridCell(j, i, this.cellSize);
            }
        }

        this.startCell = this.cells[this.width * ( Math.floor( this.height / 2 - 1)) + 1];
        this.startCell.Start = true;
        this.endCell = this.cells[this.width *( Math.floor( this.height / 2)) + this.width - 2];
        this.endCell.End = true;

        this.startCell.guessed = true;
        this.neighbourCells = this.findNeighbours(this.startCell);

        this.calculateDistances();
        
        this.updateNeighbours(this.startCell);
        
        this.canvas.addEventListener('mousedown', (e: any) => {
            this.cellClicked(e);
        })

        this.canvas.addEventListener('mouseup', (e: any) => {
            console.log("mouse up");
            this.cellReleased(e);
        })
                
    } 

    public updateNeighbours(guessedCell: GridCell) {
        guessedCell.guessed = true;
        guessedCell.guessedNeighbour = true; 

        this.findNeighbours(guessedCell).forEach(cell => {
            if (cell.guessedNeighbour == false) { 
                cell.dStart = guessedCell.dStart + this.DistanceFromPoints(cell, guessedCell);
                cell.parentCell = guessedCell;
            } else {
                if (cell.dStart > guessedCell.dStart + this.DistanceFromPoints(cell, guessedCell)) {
                    cell.dStart = guessedCell.dStart + this.DistanceFromPoints(cell, guessedCell);
                    if (cell.guessed == false) {
                        cell.parentCell = guessedCell;
                    }
                }
                //cell.dStart = Math.min(cell.dStart, guessedCell.dStart + this.DistanceFromPoints(cell, guessedCell));
            }
            cell.guessedNeighbour = true;

        });
    }
    
    public makeFastestChoice() {
        this.neighbourCells = this.cells.filter((element: GridCell) => {
            return element.guessedNeighbour && !element.filled && !element.guessed;
        });

        this.neighbourCells.sort( (a: GridCell, b: GridCell) => { 
            if (a.getTotalDistance() == b.getTotalDistance()) {
                return a.dEnd - b.dEnd;
            } else {
                return a.getTotalDistance() - b.getTotalDistance();
            }
        });
        if (this.neighbourCells.length == 0) {
            console.log("no path found");
            return;
        }
        if (this.neighbourCells[0].end) {
            console.log("end");
            this.foundPath = true;
            this.drawFinalPath();
       }

        this.updateNeighbours(this.neighbourCells[0]);
    }
    public cellClicked(e: any) {
        let rect: any = this.canvas.getBoundingClientRect();
        let posx: number = e.clientX - rect.left ;
        let posy: number = e.clientY - rect.top;
        let index: number = Math.floor(posx / this.cellSize) + Math.floor(posy / this.cellSize) * this.width;
        let selectedCell: GridCell = this.cells[index];

        if (selectedCell.start) {
            console.log("Start cell selected");
            this.startDrag = true;
        } else if (selectedCell.end) {
            this.endDrag = true;
        } else {
            selectedCell.filled = !selectedCell.filled;
        }
    }

    public clearGrid() {
        this.cells.forEach(cell => {
            cell.filled = false;
        });
    }
    public randomGrid(chance: number = 0.8) {
        this.cells.forEach(cell => {
            if (Math.random() > chance) {
                cell.filled = true; 
            } else {
                cell.filled = false;
            }
        });
        this.startCell.filled = false;
        this.endCell.filled = false;

    }
    public cellReleased(e:any) {

        if (!this.startDrag && !this.endDrag) {return;}
        let rect: any = this.canvas.getBoundingClientRect();
        let posx: number = e.clientX - rect.left ;
        let posy: number = e.clientY - rect.top;
        let index: number = Math.floor(posx / this.cellSize) + Math.floor(posy / this.cellSize) * this.width;
        let selectedCell: GridCell = this.cells[index];

        //if (selectedCell.start || selectedCell.end) { return; }


        if (this.startDrag) {
            console.log("Should release");

            this.startCell.Start = false;
            this.startCell = selectedCell;
            selectedCell.Start = true;
            this.startCell.guessed = true;
            this.reset();

            this.neighbourCells = this.findNeighbours(this.startCell);
            this.updateNeighbours(this.startCell);
        
        } else if (this.endDrag) {
            this.reset();

            this.endCell.End = false;
            this.endCell = selectedCell;
            selectedCell.End = true;
        }

        this.calculateDistances();
        this.startDrag = false;
        this.endDrag = false;
    }

    public update() {
        if (this.updatePath && !this.foundPath) {
            this.makeFastestChoice();
        }
    }
    public reset() {
        this.foundPath = false;
        this.updatePath = false;
        this.cells.forEach(cell => {
            cell.guessed = cell.finalPath = cell.guessedNeighbour = false;
            cell.parentCell = undefined;
            cell.dStart = 0;
        });

        this.updateNeighbours(this.startCell);
    }
    public drawFinalPath() {
        let currentCell = this.endCell;
        console.log("final path");

        for (let i: number = 0; i < 100; i++) {
            if (currentCell.parentCell == undefined) {
                console.log("start cell should be found");
                break;
            }
            currentCell = currentCell.parentCell;
            currentCell.finalPath = true;

        }
        // while (currentCell != this.startCell) {
        //     currentCell = currentCell.parentCell;
        //     currentCell.finalPath = true;
        // }
    }

    public contains(array: GridCell[], element: GridCell): boolean{
        array.forEach(elem => {
            if (elem == element) {
                return true;
            }
        });
        return false;
    }
    /**
     * findNeighbours
     */
    public findNeighbours(cell: GridCell): GridCell[] {
        let result: GridCell[] = [];
        let index: number = this.cells.indexOf(cell);

        let notLeft: Boolean = index % this.width > 0;
        let notRight: Boolean = (index % (this.width -0)) < this.width - 1;
        let notTop: Boolean = index > this.width -1;
        let notBottom: Boolean = index < this.cells.length - 1 - this.width;
        //not left
        if (notLeft) {
            result.push(this.cells[index - 1])
        }
        if (notRight) {
            result.push(this.cells[index + 1])
        }

        if (notTop) {
            result.push(this.cells[index - this.width])
            if (notLeft) {
                if (this.diagnoalPaths) {
                    result.push(this.cells[index - 1 - this.width])
                }
            }
            if (notRight) {
                if (this.diagnoalPaths) {
                    result.push(this.cells[index + 1 - this.width])
                }
            }

        }
        if (notBottom) {
            result.push(this.cells[index + this.width])
            if (notLeft) {
                if (this.diagnoalPaths) {
                    result.push(this.cells[index - 1 + this.width])
                }
            }
            if (notRight) {
                if (this.diagnoalPaths) {
                    result.push(this.cells[index + 1 + this.width])
                }
            }
        }

        result.forEach(cell => {
            if (cell.filled || cell.guessed) {
                result.splice(result.indexOf(cell), 1);
            }
        });

        return result;
    }
    /**
     * calculateDistances
     */
    public calculateDistances() {
        this.cells.forEach(cell => {
            //cell.dStart = this.DistanceFromPoints(cell, this.startCell);
            cell.dEnd = this.DistanceFromPoints(cell, this.endCell);
        });
    }
    public DistanceFromPoints(cellA: GridCell, cellB: GridCell): number {
        return new Vector(cellA.pos.x - cellB.pos.x,cellA.pos.y - cellB.pos.y).length();
    }
    public Draw(ctx: CanvasRenderingContext2D, canvas:any): void {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        this.cells.forEach(cell => {
            cell.Draw(ctx);
        });
        if (this.showParentLines) {
            this.cells.forEach(cell => {
                cell.DrawLine(ctx);
            });
        }
        if (this.showValues) {
            this.cells.forEach(cell => {
                cell.DrawValues(ctx);
            });
        }
        
    }
}
