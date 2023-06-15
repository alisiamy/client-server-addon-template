package org.vaadin.addons.marker_editor;

import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

/**
 * Test view for manual and automated testing of the component.
 */
@Route("")
public class ExampleView extends VerticalLayout {
    List<Marker> markers = List.of(new Marker[]{new Marker(50, 50, 20)});
    MarkerEditor editor;

    public ExampleView() throws InterruptedException {
        editor = new MarkerEditor();
        add(editor);
        //Thread.sleep(10000);
        //editor.addMarker(markers.get(0));
    }
}
