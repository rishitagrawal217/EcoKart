import React, { useEffect, useRef, useState } from 'react';
import './Chatbot.css';

// FontAwesome for icons (leaf, user)
const loadFontAwesome = () => {
  if (!document.getElementById('fa-link')) {
    const link = document.createElement('link');
    link.id = 'fa-link';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
};

const quickActions = [
  { label: 'Plastic Alternatives', icon: 'fa-recycle', query: 'plastic' },
  { label: 'Carbon Footprint', icon: 'fa-cloud', query: 'carbon' },
  { label: 'Sustainable Fashion', icon: 'fa-tshirt', query: 'fashion' },
  { label: 'Food Choices', icon: 'fa-apple-alt', query: 'food' },
  { label: 'Electronics', icon: 'fa-mobile-alt', query: 'electronics' },
  { label: 'Home & Cleaning', icon: 'fa-home', query: 'home' },
  { label: 'Beauty & Care', icon: 'fa-spa', query: 'beauty' },
  { label: 'Transportation', icon: 'fa-bus', query: 'transportation' },
  { label: 'Water Conservation', icon: 'fa-tint', query: 'water' },
];

const knowledgeBase = {
    'plastic': {
        keywords: ['plastic', 'plastic alternatives', 'plastic free', 'plastic packaging', 'single use plastic', 'microplastics', 'plastic pollution'],
        response: `🌱 Comprehensive Guide to Plastic Alternatives:\n\n**Kitchen & Food Storage:**\n• **Glass containers and jars** (reusable and infinitely recyclable)\n• **Stainless steel containers** and water bottles (lasts decades)\n• **Beeswax wraps** instead of plastic wrap (biodegradable)\n• **Silicone food storage bags** (reusable, dishwasher safe)\n• **Bamboo utensils and cutting boards** (renewable resource)\n• **Ceramic containers** (durable and non-toxic)\n• **Wooden storage boxes** (sustainable and beautiful)\n\n**Shopping & Bags:**\n• **Cotton tote bags** and mesh produce bags (washable)\n• **Jute or hemp shopping bags** (strong and biodegradable)\n• **Paper bags** (recyclable and compostable)\n• **Reusable water bottles** and coffee cups (save money)\n• **Bamboo shopping baskets** (durable and stylish)\n• **Canvas bags** (long-lasting and washable)\n\n**Personal Care:**\n• **Bamboo toothbrushes** (biodegradable handle)\n• **Shampoo bars** instead of bottled shampoo (lasts longer)\n• **Solid soap bars** (minimal packaging)\n• **Metal razors** with replaceable blades (zero waste)\n• **Bamboo cotton swabs** (biodegradable)\n• **Natural deodorant** in cardboard packaging\n• **Menstrual cups** or cloth pads (reusable)\n\n**Home & Office:**\n• **Bamboo pens** and pencils (renewable resource)\n• **Recycled paper** notebooks and stationery\n• **Natural cleaning products** in glass bottles\n• **Bamboo toothbrush holders** and organizers\n• **Cork bulletin boards** (sustainable material)\n\n**Carbon Footprint Comparison:**\n• Plastic production: ~2.5 kg CO2 per kg of plastic\n• Glass production: ~1.2 kg CO2 per kg of glass\n• Stainless steel: ~6.15 kg CO2 per kg (but lasts 20+ years)\n• Bamboo: ~0.3 kg CO2 per kg (rapidly renewable)\n• Wood: ~0.8 kg CO2 per kg (carbon neutral if sustainably sourced)\n\n**Environmental Impact:**\n• Plastic takes 400+ years to decompose\n• 8 million tons of plastic enter oceans annually\n• Microplastics found in 90% of bottled water\n• Plastic production uses 6% of global oil consumption\n\n**Pro Tips:**\n• Start with one room at a time\n• Look for "plastic-free" certifications\n• Support brands with take-back programs\n• Choose products with minimal packaging\n• Consider the full lifecycle of alternatives`
    },
    'carbon': {
        keywords: ['carbon footprint', 'carbon reduction', 'carbon emissions', 'eco-friendly', 'sustainable', 'green', 'environmental impact'],
        response: `🌱 Understanding Your Carbon Footprint:\n\n**What is a Carbon Footprint?**\n• Your carbon footprint is the total amount of greenhouse gases (primarily carbon dioxide) emitted due to your activities.\n• It's measured in equivalent metric tons of CO2.\n\n**Sources of Carbon Emissions:**\n• **Transportation:** Driving, flying, commuting, shipping.\n• **Energy Consumption:** Electricity, heating, cooling, appliances.\n• **Food & Consumption:** Meat, dairy, processed foods, transportation for food.\n• **Waste & Disposal:** Landfill waste, incineration.\n\n**How to Reduce Your Carbon Footprint:**\n• **Transportation:** Walk, bike, carpool, public transit, electric vehicles.\n• **Energy:** Switch to renewable energy sources, LED lights, energy-efficient appliances, solar panels.\n• **Food:** Eat less meat, reduce food waste, buy local, seasonal produce.\n• **Waste:** Reduce, reuse, recycle, compost, buy second-hand.\n• **Consumption:** Buy less, buy quality, buy sustainable, repair, repair, repair.\n\n**Common Myths:**\n• "Eating locally reduces carbon emissions." - Depends on transportation. If you're eating locally grown food, it's better than imported. But if you're eating imported food, it's worse.\n• "Electric cars are always better for the environment." - Depends on the source of electricity. If you charge with renewable energy, it's great. If you charge with fossil fuel energy, it's not.\n• "Wearing a t-shirt produces more carbon than a flight." - This is a common misconception. A t-shirt's carbon footprint depends on its production process, materials, and transportation. A flight's carbon footprint is much higher.\n\n**Tools & Resources:**\n• **Carbon Trust:** Provides tools and guidance for carbon reduction.\n• **The Carbon Trust:** Offers certification for carbon-neutral products.\n• **Carbon Calculator:** Websites like CarbonFootprint.com can help you calculate your personal carbon footprint.\n\n**Certifications:**\n• **CarbonNeutral:** Products certified to have zero net carbon emissions.\n• **Carbon Trust:** Products certified to have reduced carbon emissions.\n• **REDD+:** Supports conservation of forests and reduction of carbon emissions.\n\n**Pro Tips:**\n• Start small. Every little bit helps.\n• Use a carbon calculator to understand your baseline.\n• Look for products with carbon labels.\n• Consider the full lifecycle of products.`
    },
    'fashion': {
        keywords: ['sustainable fashion', 'ethical clothing', 'organic cotton', 'vegan leather', 'fair trade', 'slow fashion', 'fast fashion'],
        response: `🌱 Sustainable Fashion: Your Guide to Ethical Clothing:\n\n**What is Sustainable Fashion?**\n• Sustainable fashion is clothing and accessories made with environmentally friendly materials and processes.\n• It emphasizes ethical labor practices, fair wages, and minimal environmental impact.\n\n**Common Myths:**\n• "Sustainable fashion is more expensive." - This is a misconception. Many sustainable brands offer high-quality, durable products at competitive prices.\n• "Fast fashion is the only way to stay trendy." - Fast fashion often involves mass production, poor working conditions, and environmental damage. Slow fashion is often more sustainable and timeless.\n• "Vegan leather is better for the environment than real leather." - This depends on the source of the leather. Some vegan leathers are made from synthetic materials, while others are made from recycled materials. Real leather can be tanned sustainably.\n\n**Key Principles:**\n• **Materials:** Use organic cotton, recycled polyester, Tencel, bamboo, and other sustainable fibers.\n• **Labor:** Ensure fair wages, safe working conditions, and ethical treatment of workers.\n• **Transparency:** Know where your clothes come from, how they were made, and who made them.\n• **Durability:** Buy quality, not quantity. Clothes should last.\n• **Circularity:** Design for repair, reuse, and recycling.\n\n**Certifications:**\n• **Organic Content Standard (OCS):** For organic cotton.\n• **Global Organic Textile Standard (GOTS):** For organic cotton and other organic fibers.\n• **Fairtrade:** For fair wages and ethical labor practices.\n• **B Corp:** For companies that meet high standards of social and environmental performance.\n\n**Pro Tips:**\n• Start with a few key pieces that you love and will wear for a long time.\n• Research brands and their supply chains.\n• Look for brands that are transparent about their practices.\n• Consider the full lifecycle of your clothing.`
    },
    'food': {
        keywords: ['food choices', 'local food', 'organic food', 'vegan', 'vegetarian', 'sustainable food', 'food waste', 'food production'],
        response: `🌱 Sustainable Food Choices: Your Guide to Eco-Friendly Eating:\n\n**What is Sustainable Food?**\n• Sustainable food is food produced in a way that is environmentally friendly, socially responsible, and economically viable.\n• It emphasizes local, organic, and regenerative agriculture.\n\n**Common Myths:**\n• "Organic food is always better for the environment." - This is a misconception. Organic farming practices reduce chemical use, but not necessarily carbon emissions. Some organic methods are more carbon-intensive than conventional.\n• "Veganism is the most sustainable diet." - This is a simplification. A vegan diet is more environmentally friendly than a meat-heavy diet, but not necessarily the most sustainable. A plant-based diet with minimal waste is often the most sustainable.\n• "Local food is always better for the environment." - This is true, but not always possible. Transporting food over long distances can increase emissions. Balancing local and global food production is key.\n\n**Key Principles:**\n• **Local:** Buy food grown within a 100-mile radius to reduce transportation emissions.\n• **Organic:** Avoid synthetic fertilizers and pesticides, promoting healthier soil and biodiversity.\n• **Regenerative:** Practices that improve soil health, sequester carbon, and restore ecosystems.\n• **Veganism:** A plant-based diet is often more environmentally friendly than a meat-heavy diet, but not necessarily the most sustainable. A plant-based diet with minimal waste is often the most sustainable.\n• **Minimal Waste:** Reduce food waste at home and in the supply chain.\n\n**Certifications:**\n• **Non-GMO:** For products that are free of genetically modified organisms.\n• **Organic:** For products grown without synthetic fertilizers, pesticides, or genetic modification.\n• **Fairtrade:** For fair wages and ethical labor practices in the supply chain.\n• **B Corp:** For companies that meet high standards of social and environmental performance.\n\n**Pro Tips:**\n• Start with one or two sustainable food habits to implement.\n• Research the carbon footprint of your current diet.\n• Look for products with sustainability labels.\n• Consider the full lifecycle of your food.`
    },
    'electronics': {
        keywords: ['electronics', 'green electronics', 'energy efficiency', 'battery life', 'recycling', 'e-waste'],
        response: `🌱 Green Electronics: Your Guide to Sustainable Tech:\n\n**What is Green Electronics?**\n• Green electronics are products that are energy-efficient, use renewable energy, and are designed for durability and repairability.\n• They minimize waste and promote a circular economy.\n\n**Common Myths:**\n• "All electronics are created equal." - This is false. Some electronics have a much lower carbon footprint than others. For example, laptops have a much lower carbon footprint than TVs.\n• "Batteries are recyclable." - This is true, but not all batteries are created equal. Lithium-ion batteries are the most common and recyclable, but they contain toxic materials. Some batteries are not recyclable or are difficult to recycle.\n• "Old electronics are just trash." - This is not true. Many electronics can be repaired, refurbished, or repurposed.\n\n**Key Principles:**\n• **Energy Efficiency:** Choose products with high energy efficiency ratings (like ENERGY STAR or EnergyGuide). Lower wattage means lower energy consumption.\n• **Design for Repair:** Choose products that are easy to repair, upgrade, and recycle.\n• **Battery Life:** Choose products with long battery life and easy-to-replace batteries.\n• **Recycling:** Choose products that are easy to recycle and have a take-back program.\n• **Durability:** Buy quality, not quantity. Electronics should last.\n\n**Certifications:**\n• **Energy Star:** For energy-efficient products.\n• **EPEAT:** For environmentally preferable electronics.\n• **B Corp:** For companies that meet high standards of social and environmental performance.\n\n**Pro Tips:**\n• Start with one sustainable tech habit to implement.\n• Research the carbon footprint of your current tech usage.\n• Look for products with sustainability labels.\n• Consider the full lifecycle of your electronics.`
    },
    'home': {
        keywords: ['home products', 'sustainable home', 'cleaning products', 'zero waste', 'recycled', 'natural'],
        response: `🌱 Sustainable Home Products: Your Guide to Eco-Friendly Living:\n\n**What is Sustainable Home?**\n• Sustainable home is a space that minimizes environmental impact through design, materials, and practices.\n• It emphasizes zero waste, minimal chemical use, and durability.\n\n**Common Myths:**\n• "All cleaning products are the same." - This is false. Many conventional cleaning products contain toxic chemicals that can harm your health and the environment.\n• "Natural products are always better for the environment." - This is a simplification. Some natural products are more sustainable than others. For example, some natural cleaning products are made from concentrated, highly toxic ingredients.\n• "Zero waste is impossible." - This is not true. Many products can be reduced, reused, and recycled.\n\n**Key Principles:**\n• **Zero Waste:** Reduce, reuse, recycle, compost.\n• **Minimal Chemical Use:** Choose products with fewer, safer, and more natural ingredients.\n• **Natural:** Use products made from renewable resources, biodegradable materials, and minimal processing.\n• **Durability:** Buy quality, not quantity. Products should last.\n• **Circularity:** Design for repair, reuse, and recycling.\n\n**Certifications:**\n• **Zero Waste:** Products that are truly zero waste.\n• **B Corp:** For companies that meet high standards of social and environmental performance.\n\n**Pro Tips:**\n• Start with one sustainable home habit to implement.\n• Research the carbon footprint of your current home.\n• Look for products with sustainability labels.\n• Consider the full lifecycle of your home products.`
    },
    'beauty': {
        keywords: ['beauty products', 'sustainable beauty', 'cruelty free', 'vegan', 'natural', 'cruelty-free', 'organic'],
        response: `🌱 Sustainable Beauty: Your Guide to Cruelty-Free and Natural Products:\n\n**What is Sustainable Beauty?**\n• Sustainable beauty is products that are cruelty-free, vegan, and made with natural, non-toxic, and sustainable ingredients.\n• It emphasizes transparency, minimal waste, and ethical sourcing.\n\n**Common Myths:**\n• "Cruelty-free means no testing." - This is false. Cruelty-free means no animal testing. However, some products are tested on animals in other countries or for specific purposes.\n• "Natural products are always better for the environment." - This is a simplification. Some natural products are more sustainable than others. For example, some natural cleaning products are made from concentrated, highly toxic ingredients.\n• "Veganism is the most sustainable diet." - This is a simplification. A vegan diet is more environmentally friendly than a meat-heavy diet, but not necessarily the most sustainable. A plant-based diet with minimal waste is often the most sustainable.\n\n**Key Principles:**\n• **Cruelty-Free:** Products that are not tested on animals.\n• **Vegan:** Products that do not contain animal-derived ingredients.\n• **Natural:** Products that are minimally processed and made from natural, renewable, and biodegradable materials.\n• **Minimal Waste:** Products that are designed for repair, reuse, and recycling.\n• **Transparency:** Know where your products come from, how they were made, and who made them.\n\n**Certifications:**\n• **Cruelty-Free:** Products that are truly cruelty-free.\n• **B Corp:** For companies that meet high standards of social and environmental performance.\n\n**Pro Tips:**\n• Start with one sustainable beauty habit to implement.\n• Research brands and their supply chains.\n• Look for brands that are transparent about their practices.\n• Consider the full lifecycle of your beauty products.`
    },
    'transportation': {
        keywords: ['transportation', 'carbon footprint', 'green transportation', 'electric vehicles', 'public transit', 'biking', 'walking'],
        response: `🌱 Sustainable Transportation: Your Guide to Eco-Friendly Travel:\n\n**What is Sustainable Transportation?**\n• Sustainable transportation is any mode of travel that minimizes environmental impact and promotes social equity.\n• It emphasizes reducing emissions, using renewable energy, and promoting active modes of transportation.\n\n**Common Myths:**\n• "Electric cars are always better for the environment." - This is false. Electric cars are better for the environment if they are charged with renewable energy. If they are charged with fossil fuel energy, they are not.\n• "Public transit is always the most sustainable." - This is true, but not always possible. Distance, weather, and personal circumstances can make biking or walking more feasible.\n• "Biking is the most sustainable." - This is true, but not always possible. Distance, weather, and personal circumstances can make biking or walking more feasible.\n\n**Key Principles:**\n• **Reduce Emissions:** Choose modes of transportation that emit fewer greenhouse gases.\n• **Use Renewable Energy:** Choose modes of transportation that run on renewable energy sources.\n• **Active Modes:** Promote walking, biking, and other active modes of transportation.\n• **Public Transit:** Use public transportation systems.\n• **Electric Vehicles:** If you must drive, choose electric vehicles.\n\n**Certifications:**\n• **Energy Star:** For energy-efficient products.\n• **EPEAT:** For environmentally preferable electronics.\n• **B Corp:** For companies that meet high standards of social and environmental performance.\n\n**Pro Tips:**\n• Start with one sustainable transportation habit to implement.\n• Research the carbon footprint of your current transportation.\n• Look for products with sustainability labels.\n• Consider the full lifecycle of your transportation.`
    },
    'water': {
        keywords: ['water conservation', 'water usage', 'water scarcity', 'drought', 'rainwater harvesting', 'greywater', 'water efficiency'],
        response: `🌱 Sustainable Water Usage: Your Guide to Eco-Friendly H2O:\n\n**What is Sustainable Water?**\n• Sustainable water is water that is used efficiently, conserves resources, and minimizes environmental impact.\n• It emphasizes reducing waste, reusing water, and protecting ecosystems.\n\n**Common Myths:**\n• "Water is unlimited." - This is false. Many regions face water scarcity, especially in arid and semi-arid areas.\n• "Water is recycled." - This is true, but not all water is treated equally. Greywater (used water) is often treated and reused, but not all greywater is suitable for reuse.\n• "Water conservation is only for droughts." - This is not true. Water conservation is a year-round practice.\n\n**Key Principles:**\n• **Reduce Waste:** Minimize water waste in daily life.\n• **Reuse Water:** Reuse greywater for non-potable purposes (like watering plants).\n• **Protect Ecosystems:** Protect water sources and ecosystems.\n• **Efficiency:** Use water efficiently in daily life (shower, toilet, washing machine).\n• **Rainwater Harvesting:** Harvest rainwater for gardening and non-potable uses.\n\n**Certifications:**\n• **Zero Waste:** Products that are truly zero waste.\n• **B Corp:** For companies that meet high standards of social and environmental performance.\n\n**Pro Tips:**\n• Start with one sustainable water habit to implement.\n• Research the water footprint of your current lifestyle.\n• Look for products with sustainability labels.\n• Consider the full lifecycle of your water usage.`
    },
};

function markdownToHtml(md) {
  let html = md.replace(/[&<>]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[tag]));
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  const lines = html.split(/\r?\n/);
  let inList = false;
  let result = '';
  for (let line of lines) {
    if (/^([•-])\s?/.test(line)) {
      if (!inList) { result += '<ul>'; inList = true; }
      result += '<li>' + line.replace(/^([•-])\s?/, '') + '</li>';
    } else if (line.trim() === '') {
      if (inList) { result += '</ul>'; inList = false; }
      result += '';
    } else {
      if (inList) { result += '</ul>'; inList = false; }
      result += '<p>' + line + '</p>';
    }
  }
  if (inList) result += '</ul>';
  return result;
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content: `🌱 Hello! I'm your sustainable shopping assistant. I can help you make eco-friendly choices by providing information about:\n* Products with lower carbon footprints\n* Sustainable alternatives to everyday items\n* Green shopping tips and tricks\n* Eco-friendly brands and certifications\nWhat would you like to know about sustainable shopping today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    loadFontAwesome();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const handleSend = (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', content: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', content: generateResponse(msg) },
      ]);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (query) => {
    setInput(query);
    handleSend(query);
  };

  function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    for (const [topic, data] of Object.entries(knowledgeBase)) {
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword)) {
          return data.response;
        }
      }
    }
    return `🌱 I'd love to help you with sustainable shopping! Here are some topics I can assist with:\n\n• **Plastic alternatives** and eco-friendly packaging\n• **Carbon footprint** reduction strategies\n• **Sustainable fashion** and ethical clothing\n• **Eco-friendly food choices** and local shopping\n• **Green electronics** and energy efficiency\n• **Sustainable home products** and cleaning\n\nTry asking about any of these topics, or use the quick action buttons below for specific guidance!`;
  }

  return (
    <div className="eco-chatbot-floating">
      {open ? (
        <div className="eco-chatbot-window">
          <div className="eco-chatbot-header">
            <div className="eco-chatbot-logo">
              <i className="fas fa-leaf"></i>
              <span>EcoShop</span>
            </div>
            <button className="eco-chatbot-close" onClick={() => setOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="eco-chatbot-messages" ref={chatRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`eco-chatbot-message ${msg.sender === 'bot' ? 'bot' : 'user'}`}> 
                <div className="eco-chatbot-avatar">
                  <i className={msg.sender === 'bot' ? 'fas fa-leaf' : 'fas fa-user'}></i>
                </div>
                <div className="eco-chatbot-content" dangerouslySetInnerHTML={{ __html: msg.sender === 'bot' ? markdownToHtml(msg.content) : msg.content }} />
              </div>
            ))}
            {typing && (
              <div className="eco-chatbot-message bot">
                <div className="eco-chatbot-avatar"><i className="fas fa-leaf"></i></div>
                <div className="eco-chatbot-content">
                  <div className="eco-chatbot-typing">
                    <div className="eco-chatbot-dot"></div>
                    <div className="eco-chatbot-dot"></div>
                    <div className="eco-chatbot-dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="eco-chatbot-input-area">
            <div className="eco-chatbot-input-row">
              <input
                id="userInput"
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(input); }}
                autoComplete="off"
              />
              <button className="eco-chatbot-send" id="sendButton" onClick={() => handleSend(input)}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <div className="eco-chatbot-quick-actions">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="eco-chatbot-quick-btn"
                  data-query={action.query}
                  onClick={() => handleQuickAction(action.query)}
                >
                  <i className={`fas ${action.icon}`}></i> {action.label}
                </button>
              ))}
            </div>
          </div>
          <div className="eco-chatbot-footer">
            🌍 Making sustainable choices, one purchase at a time
          </div>
        </div>
      ) : (
        <button className="eco-chatbot-fab" onClick={() => setOpen(true)}>
          <i className="fas fa-leaf"></i>
        </button>
      )}
    </div>
  );
};

export default Chatbot; 