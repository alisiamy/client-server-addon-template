package org.vaadin.addons.marker_editor;

public class Marker {
    private int cx, cy, r;

    public Marker(int cx, int cy, int r) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    public int getCx() {
        return cx;
    }

    public int getCy() {
        return cy;
    }

    public int getR() {
        return r;
    }
}
