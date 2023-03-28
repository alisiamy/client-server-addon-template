import {css, html, LitElement, TemplateResult, PropertyValueMap } from 'lit';
import {property, customElement} from 'lit/decorators.js';
import * as d3 from 'd3';

const drawAreaSelector = '#drawArea';

@customElement('marker-editor')
export class MarkerEditorElement extends LitElement {
  private _svg : Object;

    render(): TemplateResult {

        return html`
            <input type="button" value="go" @click=${this.doDraw} />
            <div id="drawArea"></div>
        `;
    }

     constructor() {
        super();
    }

    doDraw() : void {
        //plot kram
           this._svg.append('line')
                           .style("stroke", "lightgreen")
                           .style("stroke-width", 10)
                           .attr("x1", 0)
                           .attr("y1", 0)
                           .attr("x2", 200)
                           .attr("y2", 200);
   }

    /** Invoked when a component is added to the document's DOM.
     *
     */
    connectedCallback(): void {
        super.connectedCallback();

        //construct d3 gedöns
        const element = this.shadowRoot.querySelector(drawAreaSelector);
        this._svg = d3.select(element).append('svg').attr('width', 400)
                                                                                           .attr('height', 400)
                                                                                           .style('background-color', 'black');

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