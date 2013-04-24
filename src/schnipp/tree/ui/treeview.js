

schnipp.tree.ui.TreeView = function(tree_model, ui_tree_conf) {

    var self = {}
    // @deprecated
    self.model = {
        tree_model: tree_model
    }
    self.tree_model = tree_model
    
    self.ui_tree_conf = ui_tree_conf || {}
    self.dom = {
        main: $('<div class="schnipptree-main"></div>')
    }
    self.templates = {
        'root': '<a data-node-id="" class="schnipptree-root schnipptree-treeitem" style="display:none"></a>',
        'tree_cage': '<ol data-node-id="" class="schnipptree"></ol>',
        'treeitem': _.template('\
            <li data-node-id="<%=id%>" class="<%=classes%> schnipptree-treeitem">\
                <div class="treeitem-icon"></div>\
                <div class="inner-node">\
                    <%=name%>\
                </div>\
            </li>\
        '),
    }
    
    
    self.render = function() {
        self.dom.main.empty()
        self.dom.main.disableSelection()
        self.render_tree_cage()
        
        self.model.tree_model.events.bind('clear', function(args, evt) {
            self.dom.tree_cage.empty()
        })
        
        self.model.tree_model.events.bind('insert', function(args, evt) {
            var node = args.element
            if (args.index == 0) {
                self.model.root_node = args.element
                self.dom.tree_cage.attr('data-node-id', self.model.root_node.id)
                // build root node if
                if (self.ui_tree_conf.show_root) {
                    self.dom.root.attr('data-node-id', self.model.root_node.id)
                    self.dom.root.html(self.model.root_node.get('name'))
                    self.dom.root.click(function() {
                        self.model.tree_model.set_active_node(self.model.root_node)
                    })
                    self.dom.root.show()
                    
                    self.model.root_node.events.bind('activated', function() {
                        self.show_node_tab(self.dom.root, args.node)
                    })
                    
                }
            } else {
                // overwrite self.exclude_node_type and get_prev to only show certain node types in tree
                if (!self.exclude_node_type(node)) {
                    var prev = self.get_prev(node, args.index)
                    self.insert_treeitem(node, prev)
                }
            }
        })
        return self.dom.main
    }
    
    // get the previous node which may be overwritten if only certain node types should be rendered 
    self.get_prev = function(node, index) {
        return self.model.tree_model.get(args.index-1)
    }
    
    // return a boolean indicating if a certain node type should be excluded from rendering
    self.exclude_node_type = function(node) {
        return false
    }

    self.render_tree_cage = function() {
        self.dom.tree_cage = $(self.templates.tree_cage)
        self.dom.tree_cage.addClass(self.css_class)
        self.dom.root = $(self.templates.root)
        self.dom.main.append(self.dom.root)
        self.dom.main.append(self.dom.tree_cage)
        
        self.ui_tree = schnipp.tree.ui.NestedSortable(self.dom.tree_cage).init(self.ui_tree_conf)
        self.ui_tree.events.bind('sort-stopped', function(args, evt) {
            var node = self.model.tree_model.get_by_id(args.data.node_id)
            node.move(args.data)
        })
    }

 

    self.insert_treeitem = function(node, prev) {
        var parent_id = node.get('parent_id')
        var prev_id = prev.get('id')
        var prev_level = prev.get('level')
        var level = node.get('level')  
        
        var $prev = self.dom.main.find('[data-node-id="' + prev_id + '"]').not('.schnipptree-root')
                   
        var $li = self.render_treeitem(node)
        if (node.get('level') > prev_level) {
            
            // insert as first child
            if (parent_id == self.model.root_node.get('id')) {
                // prev is the root ol
                var $ol = $prev
            } else {
                var $ols = $prev.children('ol')
                if ($ols.length > 0) {
                    $ol = $($ols[0])
                } else {
                    $ol = $('<ol></ol>')
                    $prev.append($ol)
                }
            }
            $ol.prepend($li)
        } else if (node.get('level')  == prev_level) {
            // insert after prev
            $prev.after($li)
        } else if (node.get('level') < prev_level) {
            var diff = prev_level - node.get('level')
            for (var i=1; i<=(diff); i++ ) {
                $prev = $prev.parent().parent()
            }
            $prev.after($li)
        }
            
        // set the active
        var active_node = self.tree_model.get_active_node()
        if (active_node && node.get('id') == active_node.get('id'))
            $li.addClass('treeitem-active')
        
        // activate treeitem on icon click only if it is a no-nest (leaf element)
        // otherwise a collapse/expand click would activate this node.
        $li.find('.inner-node, .treeitem-icon').click(function() {
            self.model.tree_model.set_active_node(node)
        })
        
        
        node.events.bind('activated', function(args, evt) {
            self.show_node_tab($li, args.node)
        })
        
        // open all anscenstor nodes
        node.events.bind('open', function() {
            $li.parents().removeClass('treeitem-closed')
            $li.removeClass('treeitem-closed')
        })
        // delete li if node was deleted
        node.events.bind('remove', function(args) {
            $li.remove()
        })
        
    }

    self.show_node_tab = function(elem, node) {
        self.dom.main.find('.schnipptree-treeitem').removeClass('treeitem-active')
        elem.addClass('treeitem-active')
    }
    
    
    self.render_treeitem = function(node) {
        var li = $(self.templates.treeitem({
            'id': node.get('id'),
            'name': node.get('name')
        }))
        self.ui_tree.make_collapsable(li)
        return li
    }
    
    
    self.reposition_dom_node = function(target_node, node, position) {
        var $target = self.dom.main.find('[data-node-id="' + target_node.id + '"]').not('.schnipptree-root')
        var $node = self.dom.main.find('[data-node-id="' + node.id + '"]').not('.schnipptree-root')
        //console.log('Target', $target)
        //console.log('Node', $node)
        var $ol = $target.find('ol')
        if ($ol.length > 0) {
            $ol = $($ol[0])
            $ol.prepend($node)
        } else {
            $ol = $('<ol></ol>')
            $target.append($ol)
            $ol.append($node)
        }
        self.ui_tree.dom.root.nestedSortable('refreshPositions')
        
    }
    

    return self
}








