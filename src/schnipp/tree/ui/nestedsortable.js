


schnipp.tree.ui.NestedSortable = function(root) {

    var self = {}
    self.dom = {
        'root': $(root)
    }
    
    self.events = schnipp.events.event_support()
    
          /**
    *   The concrete callback if the dragged item is a node.
    */    
    self.sort_stop = function(e, ui) {
        var li = $(ui.item)
        var ol = li.parent() 
        var parent_id = self.get_target_id(ol)
        self.events.trigger('sort-stopped', {
            evt: 'sort-stopped',
            src: self,
            parent_id: parent_id,
            data: self.get_sort_data(li, ol)
        })    
        self.dom.root.nestedSortable("refresh")
    } 
    
    self.tree_conf = {
        handle: 'div.inner-node',
        disableNesting: 'no-nest',
        errorClass: 'tree-not-allowed',
        items: 'li',
        toleranceElement: '> div.inner-node',
        placeholder: 'tree-placeholder',
        forcePlaceholderSize: true,
        distance: 8,
        maxLevels: 5,
        revert: 250,
        tabSize: 10,
        //helper : 'clone',
        dropOnEmpty: true,
        stop: self.sort_stop,
        change: function(e, ui) {
            var ancestors = ui.placeholder.parentsUntil(self.dom.root).filter('.treeitem-closed')
            if (ancestors.length > 0)
                ancestors.removeClass('treeitem-closed')
            else
                self.dom.root.nestedSortable('refreshPositions')
        },
    }
    
    self.init = function(conf) {
        conf = conf || {}
        self.tree_conf = $.extend(self.tree_conf, conf)
        
        var s = self.dom.root.nestedSortable(self.tree_conf)
        self.open_nodes = {}
        
        return self
    }
    
    
    self.make_collapsable = function(li) {
        var id = li.attr('data-node-id')
        if (self.open_nodes[id] == undefined)
            li.addClass('treeitem-closed')
            
        li.find('.treeitem-icon').click(function() {
            if (li.hasClass('treeitem-closed')) {
                li.removeClass('treeitem-closed')
                self.open_nodes[id] = true
            } else {
                li.addClass('treeitem-closed')
                delete  self.open_nodes[id]
            }
        })
    }
    
    
    
    self.get_sort_data = function(li, ol) {
        
        // get the target node
        var data = {
            node_id: li.attr('data-node-id')
        }
        var mp = self.get_most_previous(li)
       
        if (mp == null) {
            data.target_id =  self.get_target_id(ol)
            data.position = 'first-child'
        } else {
            data.target_id =  self.get_target_id(mp)
            data.position = 'right'
        }
        
        return data
    }
    
     /**
    *   Takes a potential target and returns the data-node-id property or null
    */
    self.get_target_id = function(target) {
        // the target has an attr id --> parent is li or ol with id
        if (target.attr('data-node-id')) return target.attr('data-node-id')
        else if (target.closest('li').length > 0) return target.closest('li').attr('data-node-id')
        else return null
    }
    
    
    /**
    *   Return the most previous node
    */
    self.get_most_previous = function(li) {
        var prevs = li.prevAll()
        for (var i=0; i <= prevs.length-1; i++) {    
            return prev = $(prevs[i])
        }
        return null       
    }
    
    
    return self
}
