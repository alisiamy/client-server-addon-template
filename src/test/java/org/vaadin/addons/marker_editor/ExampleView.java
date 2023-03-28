package org.vaadin.addons.marker_editor;

import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

/** Test view for manual and automated testing of the component.
 *
 */
@Route("")
public class ExampleView extends VerticalLayout {
    MarkerEditor editor = new MarkerEditor();

    public ExampleView() {

        add(editor);
    }
}
