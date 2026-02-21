import React, { useState, useEffect, useCallback } from 'react';
import config from '../config';
import './RedeemModal.css';

const RedeemModal = ({ isOpen, onClose, user, token, onRefresh }) => {
  const [availableRewards, setAvailableRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchAvailableRewards();
    }
  }, [isOpen, user, fetchAvailableRewards]);

  const fetchAvailableRewards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/eco-rewards`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const rewards = await response.json();
        setAvailableRewards(rewards);
      } else {
        console.error('Failed to fetch rewards');
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleRedeem = async (reward) => {
    if (!user || user.ecoPoints < reward.ecoPointsCost) {
      alert('Insufficient EcoPoints for this reward!');
      return;
    }

    setRedeeming(true);
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/eco-rewards/redeem`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rewardId: reward._id,
            pointsRequired: reward.ecoPointsCost,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`🎉 ${reward.name} redeemed successfully! ${result.message}`);
        onRefresh && onRefresh();
        fetchAvailableRewards();
      } else {
        const errorData = await response.json();
        alert(`Failed to redeem: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(false);
    }
  };

  const getRewardIcon = (category) => {
    switch (category) {
      case 'discount': return '💰';
      case 'free_shipping': return '🚚';
      case 'product': return '🎁';
      case 'donation': return '🌳';
      case 'cashback': return '💳';
      default: return '🎯';
    }
  };

  const getTierInfo = (tier) => {
    switch (tier) {
      case 'easy':
        return { emoji: '🟢', name: 'Easy Tier', range: '100-300 EcoPoints' };
      case 'mid':
        return { emoji: '🟡', name: 'Mid Tier', range: '400-800 EcoPoints' };
      case 'hard':
        return { emoji: '🔵', name: 'Hard Tier', range: '900-2000+ EcoPoints' };
      default:
        return { emoji: '⚪', name: 'Other', range: 'Various' };
    }
  };

  const groupRewardsByTier = (rewards) => {
    const grouped = { easy: [], mid: [], hard: [], other: [] };
    rewards.forEach((reward) => {
      if (reward.tier && grouped[reward.tier]) {
        grouped[reward.tier].push(reward);
      } else {
        grouped.other.push(reward);
      }
    });
    return grouped;
  };

  if (!isOpen || !user || !token) return null;

  const groupedRewards = groupRewardsByTier(availableRewards);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="redeem-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🌱 Redeem Your EcoPoints</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="user-points-display">
          <div className="points-info">
            <span className="points-label">Your EcoPoints:</span>
            <span className="points-value">🌱 {user.ecoPoints || 0}</span>
          </div>
          <p className="points-description">
            Redeem your EcoPoints for amazing rewards and free goodies!
          </p>
        </div>

        <div className="rewards-content">
          {loading ? (
            <div className="loading">Loading rewards...</div>
          ) : availableRewards.length === 0 ? (
            <div className="no-rewards">
              <p>No rewards available at the moment. Check back later!</p>
            </div>
          ) : (
            <div className="rewards-tiers">
              {['easy', 'mid', 'hard'].map((tier) => {
                const tierInfo = getTierInfo(tier);
                const tierRewards = groupedRewards[tier];
                if (tierRewards.length === 0) return null;
                return (
                  <div key={tier} className="reward-tier">
                    <div className="tier-header">
                      <h3 className="tier-title">{tierInfo.emoji} {tierInfo.name}</h3>
                      <span className="tier-range">{tierInfo.range}</span>
                    </div>
                    <div className="tier-description">
                      {tier === 'easy' && 'For regular green actions like buying eco-alternatives, daily logins, or sharing EcoKart with friends.'}
                      {tier === 'mid' && 'For users consistently making eco choices — like referring friends, completing challenges, or hitting monthly goals.'}
                      {tier === 'hard' && 'Premium rewards for eco champs — users who consistently choose green options, buy in bulk, or complete milestone challenges.'}
                    </div>
                    <div className="rewards-grid">
                      {tierRewards.map((reward) => (
                        <div key={reward._id} className="reward-card">
                          <div className="reward-icon">{getRewardIcon(reward.category)}</div>
                          <div className="reward-info">
                            <h3 className="reward-name">{reward.name}</h3>
                            <p className="reward-description">{reward.description}</p>
                            {reward.ecoFriendlyReason && (
                              <div className="eco-friendly-reason">
                                <span className="reason-label">🌿 Why It's Eco-Friendly:</span>
                                <span className="reason-text">{reward.ecoFriendlyReason}</span>
                              </div>
                            )}
                            <div className="reward-details">
                              <span className="reward-category">{reward.category}</span>
                              <span className="reward-value">
                                {reward.category === 'discount' && `${reward.discountPercentage}% off (max ₹${reward.maxDiscount})`}
                                {reward.category === 'free_shipping' && 'Free Shipping'}
                                {reward.category === 'cashback' && `₹${reward.maxDiscount} Cashback`}
                                {reward.category === 'donation' && 'Plant a Tree'}
                                {reward.category === 'product' && 'Free Eco Product'}
                                {reward.category === 'bonus' && `${reward.maxDiscount} Bonus Points`}
                              </span>
                            </div>
                          </div>
                          <div className="reward-action">
                            <div className="points-required">
                              <span className="points-label">🌱 {reward.ecoPointsCost} points</span>
                            </div>
                            <button
                              className={`redeem-btn ${user.ecoPoints >= reward.ecoPointsCost ? 'available' : 'insufficient'}`}
                              onClick={() => handleRedeem(reward)}
                              disabled={user.ecoPoints < reward.ecoPointsCost || redeeming}
                            >
                              {redeeming ? 'Redeeming...' : 'Redeem'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="redeem-footer">
          <div className="redeem-tips">
            <h4>💡 Tips:</h4>
            <ul>
              <li>Shop eco-friendly products to earn more EcoPoints</li>
              <li>Choose eco-friendly delivery and packaging for bonus points</li>
              <li>Redeem points regularly for maximum value</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;
