https://www.progress.com/documentation/sitefinity-cms/override-the-default-designer-buttons-mvc

Override the default designer buttons

    <script type="text/ng-template" section="modal-footer">
        <button class="btn btn-primary" ng-click="save()">Save</button>
        <a class="btn btn-link" data-dismiss="modal" ng-click="cancel()">Cancel</a>
    </script>

---

https://www.progress.com/documentation/sitefinity-cms/edit-properties-values-displayed-inside-the-property-editor-mvc

Wrt using model in controller without redeclaring variables.

    [TypeConverter(typeof(ExpandableObjectConverter))]
