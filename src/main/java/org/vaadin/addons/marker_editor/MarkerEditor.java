package org.vaadin.addons.marker_editor;

import com.vaadin.flow.component.ClientCallable;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Tag("marker-editor")
@JsModule("./marker-editor.ts")
@NpmPackage(value = "d3", version = "7.8.3")
@CssImport(value = "./marker-editor.css")
public class MarkerEditor extends Component implements HasSize {

    private List<Marker> markerList;
    private String image;
    private int width, height;

    public MarkerEditor(String background, int width, int height) {
        setWidth(width);
        setHeight(height);
        setBackground(background);
        this.markerList = new ArrayList<>();
    }

//TODO
    @ClientCallable
    public void sendMarker(String[] points) {
        markerList = Arrays.stream(points).map(Marker::parse).collect(Collectors.toList());
        System.out.println(markerList);
    }

    public void addMarker(Marker marker) {
        markerList.add(marker);
        getElement().callJsFunction("addMarker", marker.getJsPoints());
    }

    public void setBackground(String background) {
        this.image = background;
        getElement().setProperty("image", "url('" + this.image + "')");
    }

    public void setWidth(int width) {
        this.width = width;
        getElement().setProperty("width", this.width);
    }

    public void setHeight(int height) {
        this.height = height;
        getElement().setProperty("height", this.height);
    }

    private List<Marker> parseMarker(String points) {
        return null;
    }
}
