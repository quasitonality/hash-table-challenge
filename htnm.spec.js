const makeHashTable = require('./hashTableResizing/hashTableResizing.js').makeHashTable

describe('Hash Table Nightmare Mode', ()=>{
  let table, keys, values
  beforeEach(()=>{
    table = makeHashTable(true);
    keys = ['bob', 'joe', 'sally', 'steve']
    values = [1, 2, 3, 4]
    for (let i = 0; i < keys.length; i++) {
      table.insert(keys[i], values[i])
    }
  })

  describe('Basics', ()=>{

    it('Should add and retrieve values', ()=>{
      expect(table.retrieve('bob')).toBe(1)
      expect(table.retrieve('sally')).toBe(3)
    })

    it('Should not retrieve values that were removed', () => {
      table.remove('joe')
      expect(table.retrieve('joe')).toBe(undefined)
    })

    it('Should allow updating values', ()=>{
      table.insert('joe', 'is a new man')
      expect(table.retrieve('joe')).toBe('is a new man')
    })

    it('Should keep track of its size', ()=>{
      expect(table.getSize()).toBe(4)
      table.remove('joe')
      expect(table.getSize()).toBe(3)
    })

    it('Should get bigger', ()=>{
      expect(table.getLimit()).toBe(8)
    })

    it('Should get smaller', ()=>{
      table.remove('bob')
      table.remove('joe')
      table.remove('sally')
      expect(table.getLimit()).toBe(4)
    })
  })

  describe('Nightmare!', ()=>{
    it('Should handle integer keys', ()=>{
      table.insert('0', 'he\'s dead Jim')
      table.insert(0, 'Captain Kirk is climbing a mountain')
      expect(table.retrieve('0')).toBe('Captain Kirk is climbing a mountain')
      table.insert(2, 'worse than dead')
      table.insert('2', 'he\'s dead Jim')
      expect(table.retrieve(2)).toBe('he\'s dead Jim')
    })

    it('Should handle . access', ()=>{
      expect(table.bob).toBe(1)
    })

    it('Should handle [] access', ()=>{
      expect(table['bob']).toBe(1)
    })

    it('Should handle . assignment', ()=>{
      table.remove('bob')
      table.bob = 'to hug the mountain'
      expect(table.retrieve('bob')).toBe('to hug the mountain')
    })

    it('Should handle [] assignment', ()=>{
      table.remove('bob')
      table['bob'] = 'to envelope that mountain'
      expect(table.retrieve('bob')).toBe('to envelope that mountain')
    })
  })
})