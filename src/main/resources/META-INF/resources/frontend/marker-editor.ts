import {html, LitElement, PropertyValueMap, PropertyValues, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import * as d3 from 'd3';

const drawAreaSelector = '#drawArea';


@customElement('marker-editor')
export class MarkerEditorElement extends LitElement {
    private _svg; //: SVGElement | undefined;
    $server?: MarkerEditorElementServerInterface;
    @property({type: Array<String>}) markers: Array<String>;
    @property({type: String}) image: string;
    @property({type: Number}) width: number;
    @property({type: Number}) height: number;
    private toResize : SVGElement | undefined;

    public sendMessage() {
        //TODO
        this.$server!.somethingHappened("");
    }

    render(): TemplateResult {
        return [this._svg];
    }

    constructor() {
        super();
        this.markers = [];
        this.image = "";
        this._svg = d3.create("svg:svg");
        this.width = 400;
        this.height = 400;
        this._svg.attr('width', this.width);
        this._svg.attr('height', this.height);
        this.toResize = undefined;
        //construct d3 gedöns

    }

    /** Invoked when a component is added to the document's DOM.
     *
     */
    connectedCallback(): void {
        super.connectedCallback();
        //const element = this.renderRoot.querySelector(drawAreaSelector);
        //this._svg = d3.select(element).append('svg');
        //d3.select(element).append(this._svg)
        const me = this;
        this._svg.on("mousedown", function (ev: Event) {
            if (ev.target != this)
                return;
            let m = d3.pointer(ev);
            let sel = d3.select(this);
            sel.append('circle')
                .style("stroke", "lightgreen")
                .style("fill", "transparent")
                .attr('tabindex', '0')
                .attr('focusable', 'true')
                .attr("r", 10)
                .attr("cx", m[0])
                .attr("cy", m[1])
                .on("mouseover", function (ev: Event) {
                    let l = d3.select(this);
                    l.style("stroke", "red");
                })
                .on("mouseout", function (ev: Event) {
                    let l = d3.select(this);
                    l.style("stroke", "lightgreen");
                })
                .on("mousedown", function (ev: Event) {
                    this.setAttribute("resizing", "");
                })
                .on("mousemove", function (ev: Event) {
                    let l = d3.select(this);
                    if (!this.hasAttribute("resizing")) {
                        return;
                    }
                    const m = d3.pointer(ev);
                    const cx = l.attr("cx");
                    const cy = l.attr("cy");
                    const ox = m[0];
                    const oy = m[1];
                    const r = 10 + Math.ceil(Math.sqrt(((ox - cx) * (ox - cx)) + ((oy - cy) * (oy - cy))));
                    l.attr("r", r);
                })
                .on("mouseup", function (ev: Event) {
                    this.removeAttribute("resizing");
                    me.sendMessage();

                })
                .on("keyup", function (ev: KeyboardEvent) {
                    if (ev.key == "Delete" || ev.key == "Del" || ev.key == "Backspace") {
                        d3.select(this).remove();
                    }
                });
        }).on("mousemove", function (ev : MouseEvent) {
            if (me.toResize != undefined)
            {
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
        }).on("mouseup", function (ev : Event) {
            if (me.toResize != undefined)
                me.toResize = undefined;
        });
        this._svg
            .style("background", this.image);
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
            this._svg.attr("width", w);
        }
        if (changedProperties.has("height")) {
            const h = changedProperties.get("height");
            this._svg.attr("height", h);
        }
        return super.shouldUpdate(changedProperties);
    }

    addMarker(m: string) {
        const me = this;
        this.markers.push(m);
        this._svg.append("polygon")
            .attr("points", m)
            .style("stroke", "lightgreen")
            .style("fill", "transparent")
            .attr('tabindex', '0')
            .attr('focusable', 'true')
            .on("mouseover", function (ev: Event) {
                let l = d3.select(this);
                l.style("stroke", "red");
            })
            .on("mouseout", function (ev: Event) {
                let l = d3.select(this);
                l.style("stroke", "lightgreen");
            })
            .on("mousedown", function (ev: MouseEvent) {

                let pArray = me.toArray(this.getAttribute("points"));
                const m = d3.pointer(ev);
                const ox = m[0];
                const oy = m[1];

                const isOnPoint = me.onPoint(ox, oy, pArray);
                if (isOnPoint) {
                    console.log("on point");
                    this.setAttribute("resizing", isOnPoint + "," + (isOnPoint + 1));
                    if (me.toResize == undefined)
                        me.toResize = this;
                    return;
                }

                //if not on point, maybe it is on line
                const isOnLine = me.onLine(ox, oy, pArray);
                if (isOnLine) {
                    console.log("on line");
                    pArray.splice(isOnLine, 0, oy);
                    pArray.splice(isOnLine, 0, ox);
                    this.setAttribute("points", me.toString(pArray));
                    this.setAttribute("resizing", isOnLine + "," + (isOnLine + 1));
                    if (me.toResize == undefined)
                        me.toResize = this;
                }

            })
            .on("mousemove", function (ev: Event) {
                if (!this.hasAttribute("resizing")) {
                    return;
                }
                const positions = this.getAttribute("resizing").split(",").map(val => Number(val));
                let pArray = me.toArray(this.getAttribute("points"));
                const m = d3.pointer(ev);
                const ox = m[0];
                const oy = m[1];
                pArray[positions[0]] = ox;
                pArray[positions[1]] = oy;
                this.setAttribute("points", me.toString(pArray));
            })
            .on("mouseup", function (ev: Event) {
                this.removeAttribute("resizing");
                me.toResize = undefined;
                me.sendMessage();

            })
            .on("keyup", function (ev: KeyboardEvent) {
                if (ev.key == "Delete" || ev.key == "Del" || ev.key == "Backspace") {
                    d3.select(this).remove();
                }
            });
    }

    onLine(x: number, y: number, points: Array<number>): number | false {
        for (let i = 0; i < points.length - 4; i += 2) {
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
        const px1 = points[points.length -2];
        const py1 = points[points.length -1];
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
    somethingHappened(points : string): void;
}