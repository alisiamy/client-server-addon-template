package org.vaadin.addons.marker_editor;

import com.vaadin.flow.component.ClientCallable;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

import java.util.List;

@Tag("marker-editor")
@JsModule("./marker-editor.ts")
@NpmPackage(value ="d3", version = "7.8.3")
//@NpmPackage(value = "d3-polygon", version="3.0.1")
@CssImport(value = "./marker-editor.css")
public class MarkerEditor extends Component implements HasSize {

/*    private List<Marker> markerList;
    public MarkerEditor(String background, List<Marker> markerList)
    {
        this.markerList = markerList;
        this.markerList.forEach(this::addMarker);
    }*/

    @ClientCallable
    public void somethingHappened() {
        System.out.println("Something happened in the browser");
    }

    public void addMarker(Marker marker) {
        getElement().callJsFunction("addMarker", marker.getCx(), marker.getCy(), marker.getR());
    }


}
