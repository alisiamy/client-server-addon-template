package org.vaadin.addons.marker_editor;

import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.awt.Point;
import java.util.ArrayList;
import java.util.List;

/**
 * Test view for manual and automated testing of the component.
 */
@Route("")
public class ExampleView extends VerticalLayout {
    MarkerEditor editor;

    public ExampleView() {
        List<Marker> markers = new ArrayList<>();
        markers.add(new Marker(new ArrayList<>(List.of(new Point(10,10), new Point(50,50), new Point(10, 70)))));
        editor = new MarkerEditor("https://www.google.nl/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",400, 400);
        add(editor);

        editor.addMarker(
                markers.get(0));
        //Thread.sleep(10000);
    }
}
