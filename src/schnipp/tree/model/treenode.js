
schnipp.tree.model.TreeNode = function(name, modifier) {

    var self = schnipp.models.entity_type(name, function(self) {
        /**
        *   Performs the node move operation.
        *   {
                target_id: <int>,
                node_id: <int>,
                position: <"right"|"first-child">,
            }
        */
        
        
        
        /**
        *   Triggers the move operation on the server side and updates the model tree structure.
        *
        */
        self.move = function(data, callback) {
        
            callback = callback || function() {
                self.parent.set_active_node(self)
            }
        
            drf.net.post(
                self.move_url, 
                data,
                function() {
                    self.tree_model = self.parent
                    // update the internal tree representation: parent, level and the index in mptt.
                    var tnode = self.tree_model.get_by_id(data.target_id)
                    
                    if (data.position == 'first-child') {
                        console.log('FIRST', tnode, self)
                        // update parent and level
                        self.set('parent_id', tnode.id)
                        self.set('level', tnode.get('level') + 1)
                        // now insert the node at the right index: first, remove
                        var myindex = self.tree_model.index_of(self)
                        self.tree_model.data.splice(myindex, 1)
                        // then insert
                        var index = self.tree_model.index_of(tnode)
                        self.tree_model.data.splice(index + 1, 0, self) 
                    } else if (data.position == 'last-child') {
                        console.log('LAST', tnode, self)
                        // update parent and level
                        self.set('parent_id', tnode.id)
                        self.set('level', tnode.get('level') + 1)
                        // now insert the node at the right index: first, remove
                        var myindex = self.tree_model.index_of(self)
                        self.tree_model.data.splice(myindex, 1)
                        // then insert
                        var last_child = self.tree_model.get_last_child(tnode)
                        if (last_child == undefined) {
                            var index = self.tree_model.index_of(tnode)
                        } else {
                            var index = self.tree_model.index_of(last_child)
                        }
                        console.log(last_child, tnode.get('name'), 'last_child')
                        self.tree_model.data.splice(index + 1, 0, self)                        
                    } else if (data.position == 'right') {
                        console.log('RIGHT', tnode, self)
                        // update parent and level
                        self.set('parent_id', tnode.get('parent_id'))
                        self.set('level', tnode.get('level'))
                        // now insert the node at the right index: first, remove
                        var myindex = self.tree_model.index_of(self)
                        self.tree_model.data.splice(myindex, 1)
                        // then insert                        
                        var index = self.tree_model.index_of(tnode)
                        self.tree_model.data.splice(index + 1, 0, self) 
                    }
                  
                    callback()
                    
                    self.parent.events.fire(
                        'node-moved', 
                        {
                            evt: 'node-moved',
                            node: self
                        }
                    )
                }
            )
        }
        
        // return the descendants of this node        
        self.get_descendants = function(include_self) {
            if (include_self == undefined)
                include_self = true
            var descendants = []
            var prev_level = 100
            for (var i=self.parent.size()-1; i>=0; i--) {
                var node = self.parent.get(i)
                var self_index = self.parent.index_of(self)
                if (i > self_index && node.get('level') > self.get('level')) {
                    descendants.push(node)
                }
                if (prev_level > self.get('level'))
                    break
                else
                    prev_level = self.get('level')
            }
            if (include_self) {
                descendants.splice(0, 0, self)
            }
            return descendants
        }
        
        
        self.get_ascendants = function() {
            var ascs = []
            var get_parent = function(node) {
                var parent = self.parent.get_by_id(node.get('parent_id'))
                if (parent != undefined) {
                    ascs.push(parent)
                    get_parent(parent)
                }
            }
            get_parent(self)
            return ascs
        }
        
        
        
        modifier(self)
    })

    return self
}


schnipp.tree.model.TreeNodeList = function() {

    var self = schnipp.models.entity_list({})
    self.element_type = null
    self.url = null
    self.active_node = null


    self.set_active_node = function(node) {
        self.active_node = node
        self.active_node.events.trigger('activated', {
            evt: 'activated',
            src: self.active_node,
            node: self.active_node
        })
        
        var type_evt = node.get('type') + '-changed'
        self.events.trigger(type_evt, {
            evt: type_evt,
            src: self,
            node: node
        })
        // common node changed event
        self.events.trigger('node-changed', {
            evt: 'node-changed',
            src: self,
            node: node
        })
    }
    
    
    self.create_node = function(url, name, target_node, position, onsuccess) {
        var onsuccess = onsuccess || function() {}
        drf.net.put(
            url,
            {
                name: name,
                target_id: target_node.get('id'),
                position: position
            },
            function(response) {
                if (response.status == 'success') {
                    var n = self.element_type()
                    n.set_raw(response.result)
                    self.insert(self.index_of(target_node) + 1,  n)
                    onsuccess(response)
                }
            }
        )
    }
    
    
    self.get_active_node = function() {
        return self.active_node
    }
    
    // get the most previous folder
    self.get_prev_folder = function(node) {
        var prev = self.get_previous_sibling(node)
        if (prev != undefined && prev.get('type') != 'file-node') {
            return prev
        } else {
            return self.get_by_id(node.get('parent_id'))
        }
    }
    
    self.get_previous_sibling = function(node) {
        var node_index = self.index_of(node)
        for (var i=self.size()-1; i>=0; i--) {
            var sib = self.get(i)
            if (i < node_index && sib.get('level') <= node.get('level') && sib.get('id') != node.get('id')) {
                return sib
            }
        }
    }
    
    self.get_children = function(node) {
        var children = []
        self.each(function(index, elem) {
            if (elem.get('parent_id') == node.get('id'))
                children.push(elem)
        })
        return children       
    }
    
    self.get_last_child = function(node) {
        var children = self.get_children(node)
        return children[children.length-1]
    }
    
    /**
    *   Return the max level of the subtree of <node> including itself.
    */
    self.get_max_level = function(node) {
        var descendants = node.get_descendants()
        var levels = []
        for (var i=0; i<descendants.length; i++) {
            levels.push(descendants[i].get('level'))
        }
        return Math.max.apply(Math, levels)
    }
    
    
    

    return self
}





