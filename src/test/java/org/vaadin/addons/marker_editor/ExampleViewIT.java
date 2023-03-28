package org.vaadin.addons.marker_editor;


import org.junit.Assert;
import org.junit.Test;

/** Integration test for the component.
 *
 */
public class ExampleViewIT extends AbstractTestBenchIntegrationTest {

    public ExampleViewIT() {
        super();
    }

    @Test
    public void componentIsPresent()  {
        MarkerEditorElement edit = $(MarkerEditorElement.class).first();
        Assert.assertNotNull(edit);
    }
}