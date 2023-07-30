import {LitElement, PropertyValues, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import * as d3 from 'd3';


@customElement('marker-editor')
export class MarkerEditorElement extends LitElement {
    private readonly _svg; //: SVGElement | undefined;
    $server?: MarkerEditorElementServerInterface;
    @property({type: String}) image: string;
    @property({type: Number}) width: number;
    @property({type: Number}) height: number;
    private marker: Array<SVGElement>;
    private toResize: SVGElement | undefined;
    private create_poly: Array<number>;

    public sendPoints() {
        //TODO: send only the incremental change
        this.$server!.sendMarker(this.marker.map(function (poly) {
            return poly.node().getAttribute("points");
        }));
    }

    public sendCurrentPoint(m : SVGElement) {
        //TODO: send only the incremental change
        this.$server!.sendCurrentMarker(this.marker.findIndex(e => e.node() === m));
    }

    public sendNoPoint() {
        //TODO: send only the incremental change
        this.$server!.sendCurrentMarker(-1);
    }

    render(): TemplateResult {
        return [this._svg];
    }

    constructor() {
        super();
        this.image = "";
        this._svg = d3.create("svg:svg");
        this.width = 400;
        this.height = 400;
        this._svg.attr('width', this.width);
        this._svg.attr('height', this.height);
        this.toResize = undefined;
        this.create_poly = [];
        this.marker = [];
        //construct d3 gedöns

    }

    /** Invoked when a component is added to the document's DOM.
     *
     */
    connectedCallback(): void {
        super.connectedCallback();
        const me = this;
        this._svg.on("mousedown", function (ev: Event) {
            if (ev.target != this) {
                me.create_poly = [];
                return;
            }
            let m = d3.pointer(ev);
            let sel = d3.select(this);
            me.create_poly.push(m[0]);
            me.create_poly.push(m[1]);
            //assert(me.create_poly.length % 2 == 0, "number of entries does not match number of points");
            if (me.create_poly.length >= 6) //need at least triangle for polygon
            {
                me.marker.push(sel.append('polygon')
                    .style("stroke", "lightgreen")
                    .style("fill", "transparent")
                    .attr('tabindex', '0')
                    .attr('focusable', 'true')
                    .attr("points", me.toString(me.create_poly))
                    .on("mouseover", function (ev: Event) {
                        let l = d3.select(this);
                        l.style("stroke", "red");
                        me.sendCurrentPoint(this);
                    })
                    .on("mouseout", function (ev: Event) {
                        let l = d3.select(this);
                        l.style("stroke", "lightgreen");
                        me.sendNoPoint();
                    })
                    .on("mousedown", function (ev: MouseEvent) {
                        me.mouseDownHandler(this, ev);
                    })
                    .on("mousemove", function (ev: KeyboardEvent) {
                        me.mouseMoveHandler(this, ev);
                    })
                    .on("mouseup", function (ev: Event) {
                        this.removeAttribute("resizing");
                        me.toResize = undefined;
                        me.sendPoints();

                    })
                    .on("keyup", function (ev: KeyboardEvent) {
                        me.deleteKeyPressHandler(this, ev);
                    }));
            }
        }).on("mousemove", function (ev: MouseEvent) {
            if (me.toResize != undefined) {
                if (!me.toResize.hasAttribute("resizing")) {
                    return;
                }
                const positions = me.toResize.getAttribute("resizing").split(",").map(val => Number(val));
                let pArray = me.toArray(me.toResize.getAttribute("points"));
                const m = d3.pointer(ev);
                const ox = m[0];
                const oy = m[1];
                pArray[positions[0]] = ox;
                pArray[positions[1]] = oy;
                me.toResize.setAttribute("points", me.toString(pArray));
            }
        }).on("mouseup", function (ev: Event) {
            if (me.toResize != undefined)
                me.toResize = undefined;
        });
        this._svg
            .style("background", this.image);
        this._svg.attr('width', this.width);
        this._svg.attr('height', this.height);
    }

    private mouseDownHandler(obj: SVGElement, ev: MouseEvent) {
        let pArray = this.toArray(obj.getAttribute("points"));
        const m = d3.pointer(ev);
        const ox = m[0];
        const oy = m[1];
//TODO: don't find first match, find best match with smallest distance
        const isOnPoint = this.onPoint(ox, oy, pArray);
        if (isOnPoint) {
            obj.setAttribute("resizing", isOnPoint + "," + (isOnPoint + 1));
            if (this.toResize == undefined)
                this.toResize = obj;
            return;
        }

        //if not on point, maybe it is on line
        const isOnLine = this.onLine(ox, oy, pArray);
        if (isOnLine) {
            pArray.splice(isOnLine, 0, oy);
            pArray.splice(isOnLine, 0, ox);
            obj.setAttribute("points", this.toString(pArray));
            obj.setAttribute("resizing", isOnLine + "," + (isOnLine + 1));
            if (this.toResize == undefined)
                this.toResize = obj;
        }
    }

    private mouseMoveHandler(obj: SVGElement, ev: KeyboardEvent) {
        if (!obj.hasAttribute("resizing")) {
            return;
        }
        const positions = obj.getAttribute("resizing").split(",").map(val => Number(val));
        let pArray = this.toArray(obj.getAttribute("points"));
        const m = d3.pointer(ev);
        const ox = m[0];
        const oy = m[1];
        pArray[positions[0]] = ox;
        pArray[positions[1]] = oy;
        obj.setAttribute("points", this.toString(pArray));
    }

    /** Controls whether an update rendering should proceed.
     *
     *  We only override this to restart the timer if 'updateInterval' property has changed.
     *
     */
    shouldUpdate(changedProperties: PropertyValues<any>) {
        if (changedProperties.has('image')) {
            const im = changedProperties.get("image");
            this._svg.attr("background", im);
        }
        if (changedProperties.has("width")) {
            const w = changedProperties.get("width");
            this.width = w;
            this._svg.attr("width", w);
        }
        if (changedProperties.has("height")) {
            const h = changedProperties.get("height");
            this.height = h;
            this._svg.attr("height", h);
        }
        return super.shouldUpdate(changedProperties);
    }

    clearMarker() {
        this.marker.forEach(m => d3.select(m).remove());
        this.marker = [];
    }

    addMarker(m: string) {
        const me = this;
        me.marker.push(this._svg.append("polygon")
            .attr("points", m)
            .style("stroke", "lightgreen")
            .style("fill", "transparent")
            .attr('tabindex', '0')
            .attr('focusable', 'true')
            .on("mouseover", function (ev: Event) {
                let l = d3.select(this);
                l.style("stroke", "red");
                me.sendCurrentPoint(this);
            })
            .on("mouseout", function (ev: Event) {
                let l = d3.select(this);
                l.style("stroke", "lightgreen");
                me.sendNoPoint();
            })
            .on("mousedown", function (ev: MouseEvent) {
                me.mouseDownHandler(this, ev);
            })
            .on("mousemove", function (ev: KeyboardEvent) {
                me.mouseMoveHandler(this, ev);
            })
            .on("mouseup", function (ev: Event) {
                this.removeAttribute("resizing");
                me.toResize = undefined;
                me.sendPoints();

            })
            .on("keyup", function (ev: KeyboardEvent) {
                me.deleteKeyPressHandler(this, ev);
            }));
    }

    private deleteKeyPressHandler(obj: SVGElement, ev: KeyboardEvent) {
        if (ev.key == "Delete" || ev.key == "Del" || ev.key == "Backspace") {
            //delete poly from marker list
            this.marker.splice(this.marker.findIndex(m => m.node() === obj), 1);
            d3.select(obj).remove();
            this.sendPoints();
        }
    }

    onLine(x: number, y: number, points: Array<number>): number | false {
        for (let i = 0; i <= points.length - 3; i += 2) {
            const px1 = points[i];
            const py1 = points[i + 1];
            const px2 = points[i + 2];
            const py2 = points[i + 3];

            const res = ((px2 - px1) * (py1 - y) - (px1 - x) * (py2 - py1)) /
                Math.sqrt(((px2 - px1) * (px2 - px1)) + ((py2 - py1) * (py2 - py1)))
            if (Math.abs(res) <= 3)
                return i + 2;
        }

        //last -> first
        const px1 = points[points.length - 2];
        const py1 = points[points.length - 1];
        const px2 = points[0];
        const py2 = points[1];

        const res = ((px2 - px1) * (py1 - y) - (px1 - x) * (py2 - py1)) /
            Math.sqrt(((px2 - px1) * (px2 - px1)) + ((py2 - py1) * (py2 - py1)))
        if (Math.abs(res) <= 3)
            return points.length;

        return false;
    }

    onPoint(x: number, y: number, points: Array<number>): number | false {
        for (let i = 0; i < points.length; i += 2) {
            const px1 = points[i];
            const py1 = points[i + 1];

            const res = Math.sqrt((x - px1) * (x - px1) + (py1 - y) * (py1 - y))

            if (Math.abs(res) <= 3)
                return i;
        }

        return false;
    }

    toArray(points: string): Array<number> {
        return points.split(" ").map(value => Number(value));
    }

    toString(points: Array<number>): string {
        return points.join(" ");
    }
}

interface MarkerEditorElementServerInterface {
    sendMarker(points: Array<String>): void;
    sendCurrentMarker(m: number): void;
}