package org.vaadin.addons.marker_editor;

import java.awt.*;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Marker {
    public String getJsPoints() {
        return Arrays.stream(points).mapToObj(Integer::toString).collect(Collectors.joining(" "));
    }


    private int[] points;

    public Marker(List<Point> points) {
        assert (points.size() % 2 == 0);
        assert(points.size() >= 6);
        this.points = new int[points.size() * 2];
        for (var i = 0; i < points.size(); i += 2) {
            this.points[i] = points.get(i).x;
            this.points[i + 1] = points.get(i).y;
        }
    }

}
