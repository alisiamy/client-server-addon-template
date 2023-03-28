package org.vaadin.addons.marker_editor;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

@Tag("marker-editor")
@JsModule("./marker-editor.ts")
@NpmPackage(value ="d3", version = "7.8.3")
@CssImport(value = "./marker-editor.css")
public class MarkerEditor extends Component implements HasSize {
}
