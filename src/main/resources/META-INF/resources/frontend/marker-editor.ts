import {css, html, LitElement, TemplateResult, PropertyValueMap} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import * as d3 from 'd3';
import {readFileSync} from "fs";

const drawAreaSelector = '#drawArea';

@customElement('marker-editor')
export class MarkerEditorElement extends LitElement {
    private _svg: SVGElement | undefined;
    private line: SVGLineElement | undefined;

    render(): TemplateResult {

        /*return html`
            <input type="button" value="go" @click=${this.doDraw} />
            <div id="drawArea"></div>
        `;*/
        return html`
            <div id="drawArea"></div>
        `;
    }

    constructor() {
        super();
        //construct d3 gedöns

    }

    mousedown(ev: Event) {
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
            .on("mousedown", function (ev : Event) {
                this.setAttribute("resizing", "");
            })
            .on("mousemove", function (ev :Event) {
                let l = d3.select(this);
                if (!this.hasAttribute("resizing"))
                {
                    return;
                }
                let m = d3.pointer(ev);
                const cx = l.attr("cx");
                const cy = l.attr("cy");
                const ox = m[0];
                const oy = m[1];
                const r = 10+Math.ceil(Math.sqrt(((ox - cx) * (ox - cx)) + ((oy - cy) * (oy - cy))));
                l.attr("r", r);
            })
            .on("mouseup", function (ev : Event) {
                this.removeAttribute("resizing");

            })
            .on("keyup", function(ev:KeyboardEvent) {
                if(ev.key == "Delete" || ev.key == "Del" || ev.key == "Backspace"){
                    d3.select(this).remove();
                }
            });
    }



    /** Invoked when a component is added to the document's DOM.
     *
     */
    connectedCallback(): void {
        super.connectedCallback();
        const element = this.renderRoot.querySelector(drawAreaSelector);
        this._svg = d3.select(element).append('svg');
        this._svg.attr('width', 400);
        this._svg.on("mousedown", this.mousedown);
        //.on("mouseup", this.mouseup)
        this._svg.attr('height', 400)
        this._svg
            .style("background", "url('https://www.google.nl/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png')");
    }

    /** Controls whether an update rendering should proceed.
     *
     *  We only override this to restart the timer if 'updateInterval' property has changed.
     *
     */
    shouldUpdate(changedProperties: PropertyValueMap<any>) {
        return super.shouldUpdate(changedProperties);
    }


}