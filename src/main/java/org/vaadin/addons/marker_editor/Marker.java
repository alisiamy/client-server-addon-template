package org.vaadin.addons.marker_editor;

import java.awt.Point;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Marker {
    private List<Integer> points;

    public String getJsPoints() {
        return points.stream().map(Objects::toString).collect(Collectors.joining(" "));
    }

    private Marker() {

    }

    public Marker(List<Point> points) {
        assert (points.size() >= 3);
        this.points = new ArrayList<>();
        for (var point : points) {
            this.points.add(point.x);
            this.points.add(point.y);
        }
    }

    private static Marker fromInts(List<Integer> points) {
        assert (points.size() % 2 == 0);
        assert (points.size() >= 6);
        var tmp = new Marker();
        tmp.points = points;
        return tmp;
    }

    public static Marker parse(String points) {
        return Marker.fromInts(Arrays.stream(points.split(" ")).map(Integer::valueOf).collect(Collectors.toList()));
    }

    public List<Point> getPoints()
    {
        List<Point> ret = new ArrayList<>();
        for (var i = 0; i < points.size(); i+=2)
            ret.add(new Point(points.get(i), points.get(i+1)));

        return ret;
    }

    @Override
    public String toString() {
        return "Marker {" + "points=" + points + "}";
    }
}
